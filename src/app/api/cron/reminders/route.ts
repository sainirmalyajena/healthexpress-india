import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { whatsappService } from '@/lib/services/whatsapp.service';

export async function GET(req: NextRequest) {
    // Check authorization header to ensure it's from Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();
        const results: any[] = [];

        // 1. Find OPDs scheduled for tomorrow (Pre-OPD reminder)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const opdsTomorrow = await prisma.lead.findMany({
            where: {
                opdDate: { gte: tomorrow, lte: endOfTomorrow },
                status: 'OPD_SCHEDULED',
            },
            include: { hospital: true }
        });

        for (const lead of opdsTomorrow) {
            const hospitalName = lead.hospital?.name || 'our partner hospital';
            const message = `Hi ${lead.fullName},\n\nThis is a friendly reminder from HealthExpress India for your consultation at *${hospitalName}* tomorrow.\n\nPlease try to arrive 15 minutes early. If you need directions or need to reschedule, please reply to this message.`;

            try {
                const phoneForWhatsapp = lead.phone.replace(/[^0-9]/g, '');
                const finalPhone = phoneForWhatsapp.length === 10 ? `91${phoneForWhatsapp}` : phoneForWhatsapp;
                
                await whatsappService.sendTextMessage(finalPhone, message);
                results.push({ leadId: lead.id, phone: finalPhone, type: 'pre_opd_reminder', status: 'success' });
            } catch (err: any) {
                console.error(`Failed to send pre-OPD reminder to ${lead.id}`, err);
                results.push({ leadId: lead.id, type: 'pre_opd_reminder', status: 'error', error: err.message });
            }
        }

        // 2. Find OPDs completed today whose time is done (Post-OPD follow-up)
        // Checks appointments scheduled before now that haven't been sent follow-up yet
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const completedOpds = await prisma.lead.findMany({
            where: {
                opdDate: { gte: startOfToday, lte: now },
                status: { in: ['OPD_SCHEDULED', 'OPD_DONE', 'RNR_POST_OPD'] },
                followUpNotified: false,
            },
            include: { hospital: true, surgery: true },
            take: 50
        });

        for (const lead of completedOpds) {
            const hospitalName = lead.hospital?.name || 'our partner hospital';
            const surgeryName = lead.surgery?.name ? ` regarding your ${lead.surgery.name}` : '';
            const followUpMessage = `Dear ${lead.fullName},\n\nWe hope your consultation with the doctor at *${hospitalName}*${surgeryName} went smoothly today! 🏥\n\nOur medical care team is following up to assist you:\n1️⃣ Did the doctor recommend any medication, diagnostic tests, or surgery?\n2️⃣ Do you need any help with 100% cashless insurance approval or test discounts?\n3️⃣ Do you have any questions or doctor follow-up needs?\n\nPlease reply to this message or call us anytime at 93078-61041. Wishing you good health!\n\nWarm regards,\nHealthExpress India Care Team`;

            try {
                const phoneForWhatsapp = lead.phone.replace(/[^0-9]/g, '');
                const finalPhone = phoneForWhatsapp.length === 10 ? `91${phoneForWhatsapp}` : phoneForWhatsapp;

                await whatsappService.sendTextMessage(finalPhone, followUpMessage);
                
                // Mark followUpNotified so it doesn't duplicate
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: { followUpNotified: true }
                });

                results.push({ leadId: lead.id, phone: finalPhone, type: 'post_opd_followup', status: 'success' });
            } catch (err: any) {
                console.error(`Failed to send post-OPD follow-up to ${lead.id}`, err);
                results.push({ leadId: lead.id, type: 'post_opd_followup', status: 'error', error: err.message });
            }
        }

        return NextResponse.json({ 
            success: true, 
            tomorrowReminders: opdsTomorrow.length,
            completedFollowUps: completedOpds.length,
            results 
        });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
