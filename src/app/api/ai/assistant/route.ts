import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Fetch surgeries for context
        const surgeries = await prisma.surgery.findMany({
            select: {
                name: true,
                slug: true,
                category: true,
                overview: true,
                costRangeMin: true,
                costRangeMax: true,
            },
        });

        const surgeryContext = surgeries.map(s =>
            `- ${s.name} (${s.category}): ${s.overview}. Cost: ₹${s.costRangeMin} - ₹${s.costRangeMax}`
        ).join('\n');

        const systemPrompt = `
You are MedBot, a helpful and professional AI assistant for HealthExpress India.
HealthExpress India is a platform that simplifies surgical care by providing affordable, high-quality treatments and surgery assistance.

Your goals:
1. Help users find information about surgeries.
2. Provide estimated costs based on the context provided.
3. Encourage users to book a consultation or contact us for precise details.
4. Always include a disclaimer that you are an AI assistant and users should consult a doctor for official medical advice.

Available surgeries and details:
${surgeryContext}

Tone: Empathetic, professional, and clear.
Languages: You can respond in English or Hindi (Roman script or Devanagari) as per the user's preference.

If a user asks about a surgery not in the list, tell them you are not sure if we cover it yet but they can leave their contact details for our team to check.
`;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'Understood. I am MedBot, your HealthExpress India assistant. How can I help you today?' }] },
                ...(history || []).map((h: any) => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('AI Assistant Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
