import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/lib/validations';
import { generateReferenceId, extractUTMParams } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

async function checkRateLimit(): Promise<boolean> {
    return true;
}

// Uses Gemini to classify lead urgency and extract intent from the description
async function classifyLead(description: string, surgeryName: string): Promise<{
    urgency: 'EMERGENCY' | 'URGENT' | 'ELECTIVE';
    intent: string;
    suggestedNotes: string;
}> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { urgency: 'ELECTIVE', intent: surgeryName, suggestedNotes: '' };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
You are a medical triage assistant for HealthExpress India. Classify this patient inquiry.

Surgery: ${surgeryName}
Patient message: "${description}"

Respond ONLY with a JSON object (no markdown, no explanation):
{
  "urgency": "EMERGENCY" | "URGENT" | "ELECTIVE",
  "intent": "one line describing what patient needs",
  "suggestedNotes": "brief ops team note (max 20 words)"
}

EMERGENCY = chest pain, stroke, broken bone, can't breathe, severe bleeding
URGENT = significant pain, infection, condition worsening, need surgery within weeks
ELECTIVE = routine procedure, researching options, cost inquiry, no time pressure
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return { urgency: 'ELECTIVE', intent: surgeryName, suggestedNotes: '' };
    }
}

export async function POST(request: NextRequest) {
    try {
        const allowed = await checkRateLimit();
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        const parsed = leadFormSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Honeypot
        if (data.website && data.website.length > 0) {
            return NextResponse.json({ success: true, referenceId: generateReferenceId() });
        }

        // Verify surgery exists
        let surgery = await prisma.surgery.findFirst({
            where: {
                OR: [
                    { id: data.surgeryId },
                    { name: { equals: data.surgeryId, mode: 'insensitive' } },
                    { slug: { equals: data.surgeryId, mode: 'insensitive' } },
                ],
            },
        });

        if (!surgery) {
            surgery = await prisma.surgery.findFirst({
                where: { OR: [{ name: 'General Consultation' }, { name: 'Other' }] },
            });
        }
        if (!surgery) surgery = await prisma.surgery.findFirst();
        if (!surgery) {
            return NextResponse.json({ error: 'No surgery options available' }, { status: 400 });
        }

        // UTM parsing
        let utmSource, utmCampaign, utmMedium, utmTerm, utmContent;
        try {
            const utmParams = extractUTMParams(body.sourcePage || 'https://healthexpressindia.com');
            utmSource = utmParams.source;
            utmCampaign = utmParams.campaign;
            utmMedium = utmParams.medium;
            utmTerm = utmParams.term;
            utmContent = utmParams.content;
        } catch { /* ignore */ }

        const referenceId = generateReferenceId();

        // AI lead classification (runs in parallel with DB save)
        const [classification] = await Promise.allSettled([
            classifyLead(data.description || '', surgery.name),
        ]);

        const aiResult = classification.status === 'fulfilled'
            ? classification.value
            : { urgency: 'ELECTIVE' as const, intent: surgery.name, suggestedNotes: '' };

        // Auto-escalate emergency leads
        const initialStatus = aiResult.urgency === 'EMERGENCY' ? 'CONTACTED' : 'NEW';

        const notesContent = [
            aiResult.urgency !== 'ELECTIVE' ? `[${aiResult.urgency}]` : '',
            aiResult.suggestedNotes,
        ].filter(Boolean).join(' ');

        // Save to DB
        await prisma.lead.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                email: data.email || null,
                city: data.city,
                surgeryId: surgery.id,
                description: data.description || `Inquiry for ${surgery.name}`,
                insurance: data.insurance,
                callbackTime: data.callbackTime,
                sourcePage: body.sourcePage || '/',
                utmSource,
                utmCampaign,
                utmMedium,
                utmTerm,
                utmContent,
                referenceId,
                status: initialStatus,
                notes: notesContent || null,
            },
        });

        // Emails
        try {
            const { sendEmail, emailTemplates } = await import('@/lib/mailer');

            if (data.email) {
                const template = emailTemplates.leadConfirmation(data.fullName, referenceId, surgery.name);
                await sendEmail({ to: data.email, ...template });
            }

            const urgencyPrefix = aiResult.urgency !== 'ELECTIVE'
                ? `🚨 ${aiResult.urgency}: `
                : '';

            const adminTemplate = emailTemplates.adminInquiry({
                referenceId,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email || undefined,
                city: data.city,
                surgeryName: `${urgencyPrefix}${surgery.name}`,
                sourcePage: body.sourcePage || '/',
            });

            await sendEmail({
                to: process.env.OPS_EMAIL || 'healthexpressindia@healthexpressindia.com',
                ...adminTemplate,
            });
        } catch (emailErr) {
            console.error('Email error:', emailErr);
        }

        return NextResponse.json({ success: true, referenceId });

    } catch (error) {
        console.error('Lead creation error:', error);
        return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
    }
}
