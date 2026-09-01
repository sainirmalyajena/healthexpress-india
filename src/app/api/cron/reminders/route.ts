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
        // Find OPDs scheduled for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const opds = await prisma.lead.findMany({
            where: {
                opdDate: { gte: tomorrow, lte: endOfTomorrow },
                status: 'OPD_SCHEDULED',
            },
            include: { hospital: true }
        });

        const results = [];

        for (const lead of opds) {
            const hospitalName = lead.hospital?.name || 'our partner hospital';
            // Note: Since we are using WhatsApp API, we need to send an approved template message if outside the 24h window.
            // For now, we will send a standard text message. If it fails due to the 24h rule, you'll need to create a Meta Template.
            const message = `Hi ${lead.fullName},\n\nThis is a friendly reminder from HealthExpress India for your consultation at *${hospitalName}* tomorrow.\n\nPlease try to arrive 15 minutes early. If you need directions or need to reschedule, please reply to this message.`;

            try {
                // Remove spaces, + and non-numeric characters from phone
                const phoneForWhatsapp = lead.phone.replace(/[^0-9]/g, '');
                
                // Add country code if missing (assuming India +91)
                const finalPhone = phoneForWhatsapp.length === 10 ? `91${phoneForWhatsapp}` : phoneForWhatsapp;
                
                await whatsappService.sendTextMessage(finalPhone, message);
                results.push({ leadId: lead.id, phone: finalPhone, status: 'success' });
            } catch (err: any) {
                console.error(`Failed to send OPD reminder to ${lead.id}`, err);
                results.push({ leadId: lead.id, status: 'error', error: err.message });
            }
        }

        return NextResponse.json({ success: true, processed: opds.length, results });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

