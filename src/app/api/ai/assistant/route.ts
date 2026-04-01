import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import { surgeryContent as fallbackSurgeries } from '../../../../../prisma/surgery-content';

export async function POST(req: NextRequest) {
    try {
        const { message, history, context } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Try stable model names in order of preference
        const MODEL_PREFERENCE = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];
        const model = genAI.getGenerativeModel({ model: MODEL_PREFERENCE[0] });

        // Fetch surgeries for context with fallback
        let surgeryContext = '';
        try {
            const surgeries = await prisma.surgery.findMany({
                select: {
                    name: true,
                    slug: true,
                    category: true,
                    overview: true,
                    costRangeMin: true,
                    costRangeMax: true,
                    availableCities: true,
                    insuranceLikely: true,
                },
            });

            if (surgeries.length > 0) {
                surgeryContext = surgeries.map(s =>
                    `- ${s.name} (${s.category}): ${s.overview.substring(0, 100)}. Cost: ₹${s.costRangeMin.toLocaleString('en-IN')} - ₹${s.costRangeMax.toLocaleString('en-IN')}. Insurance: ${s.insuranceLikely ? 'Likely covered' : 'Usually self-pay'}. Cities: ${s.availableCities.slice(0, 5).join(', ')}.`
                ).join('\n');
            } else {
                throw new Error('No surgeries found in database');
            }
        } catch (dbError) {
            console.warn('Database unreachable or empty, using fallback surgery content:', dbError instanceof Error ? dbError.message : 'Unknown error');
            // Use fallback from prisma/surgery-content.ts
            surgeryContext = Object.entries(fallbackSurgeries).map(([name, content]) => 
                `- ${name}: ${content.overview.substring(0, 100)}...`
            ).join('\n');
        }

        // If user is on a specific surgery page, inject that context
        const pageContext = context?.surgeryName
            ? `\nThe user is currently viewing the "${context.surgeryName}" surgery page.`
            : '';

        const systemPrompt = `
You are MedBot, a warm, professional AI assistant for HealthExpress India — India's trusted surgery facilitation platform.

Your mission:
1. Help patients understand their surgery options, costs, and what to expect.
2. Give honest cost ranges from the data below — never make up numbers.
3. Gently guide patients toward calling 93078-61041 or filling the inquiry form for a free consultation.
4. Always end responses with a clear next step — either a phone number, a link to the surgery page, or the contact form.
5. If someone sounds worried or mentions pain/emergency, prioritize getting them to call immediately.

Key facts about HealthExpress India:
- ₹0 consultation fee — we never charge to help patients find care
- 500+ partner hospitals across India
- We help with insurance paperwork, cashless treatment, and hospital admission
- Transparent pricing — no hidden costs
- Phone: 93078-61041 (Mon-Sat, 9AM-6PM)
- WhatsApp: +91 93078-61041
${pageContext}

Available surgeries with costs:
${surgeryContext}

Rules:
- Keep responses concise — 2-4 sentences max unless explaining a complex procedure
- Never diagnose. Always say "based on what you've described, this sounds like it could be [X], but please consult a doctor"
- Respond in English or Hindi based on user's language
- Be empathetic — patients are often scared and in pain
- If asked about cost, always give the range AND mention it varies by city and hospital tier
- If user mentions city (Mumbai, Delhi, etc.), note costs are typically 10-25% higher in metro cities
`;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'Understood. I am MedBot, your HealthExpress India assistant.' }] },
                ...(history || []).map((h: { role: string; content: string }) => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(message);
        const text = (await result.response).text();
        return NextResponse.json({ text });

    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'unknown';
        console.error('AI Assistant Error:', errMsg);
        return NextResponse.json({ 
            error: 'Failed to process request',
            debug: process.env.NODE_ENV === 'development' ? errMsg : undefined
        }, { status: 500 });
    }
}
