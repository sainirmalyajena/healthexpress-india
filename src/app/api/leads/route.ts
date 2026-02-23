import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/lib/validations';
import { generateReferenceId, extractUTMParams } from '@/lib/utils';
import { resend } from '@/lib/resend';
import LeadConfirmation from '@/emails/LeadConfirmation';
import AdminNotification from '@/emails/AdminNotification';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Rate limiting disabled for Demo Mode
async function checkRateLimit(): Promise<boolean> {
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Check rate limit
        const allowed = await checkRateLimit();
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Validate input
        const parsed = leadFormSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Check honeypot (spam protection)
        if (data.website && data.website.length > 0) {
            // Silently reject but return success to confuse bots
            return NextResponse.json({
                success: true,
                referenceId: generateReferenceId()
            });
        }

        // Verify surgery exists
        let surgery = await prisma.surgery.findFirst({
            where: {
                OR: [
                    { id: data.surgeryId },
                    { name: { equals: data.surgeryId, mode: 'insensitive' } },
                    { slug: { equals: data.surgeryId, mode: 'insensitive' } }
                ]
            }
        });

        // Fallback for custom surgery names
        if (!surgery) {
            // Check for a default "Other" surgery OR create one
            surgery = await prisma.surgery.findFirst({
                where: { OR: [{ name: 'General Consultation' }, { name: 'Other' }] }
            });

            if (!surgery) {
                // Last resort: find any surgery to keep schema happy (shouldn't really happen in production if seed runs)
                surgery = await prisma.surgery.findFirst();
            }
        }

        if (!surgery) {
            return NextResponse.json({ error: 'No surgery options available' }, { status: 400 });
        }

        // Parse UTM parameters from source page
        let utmSource, utmCampaign, utmMedium, utmTerm, utmContent;
        try {
            const utmParams = extractUTMParams(body.sourcePage || 'https://healthexpress.in');
            utmSource = utmParams.source;
            utmCampaign = utmParams.campaign;
            utmMedium = utmParams.medium;
            utmTerm = utmParams.term;
            utmContent = utmParams.content;
        } catch {
            // Invalid URL, ignore
        }

        // Generate reference ID
        const referenceId = generateReferenceId();

        // Save to Database
        await prisma.lead.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                email: data.email || null,
                city: data.city,
                surgeryId: data.surgeryId,
                description: `Inquiry for ${surgery.name}`,
                insurance: data.insurance,
                callbackTime: data.callbackTime,
                sourcePage: body.sourcePage || '/',
                utmSource,
                utmCampaign,
                utmMedium,
                utmTerm,
                utmContent,
                referenceId,
                status: 'NEW'
            }
        });

        // Send emails via centralized mailer
        try {
            const { sendEmail, emailTemplates } = await import('@/lib/mailer');

            // 1. Send confirmation to Patient if email provided
            if (data.email) {
                const template = emailTemplates.leadConfirmation(data.fullName, referenceId, surgery.name);
                await sendEmail({
                    to: data.email,
                    ...template
                });
            }

            // 2. Notify Ops Team (Admin)
            const adminTemplate = emailTemplates.adminInquiry({
                referenceId,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email || undefined,
                city: data.city,
                surgeryName: surgery.name,
                sourcePage: body.sourcePage || '/'
            });

            await sendEmail({
                to: process.env.OPS_EMAIL || 'healthexpressindia@healthexpressindia.com',
                ...adminTemplate
            });

        } catch (emailErr) {
            console.error('Email preparation error:', emailErr);
        }

        return NextResponse.json({
            success: true,
            referenceId,
        });
    } catch (error) {
        console.error('Lead creation error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
