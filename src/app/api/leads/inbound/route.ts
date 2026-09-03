import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        // Accept either the one I gave you, or the one in your screenshot
        const validKeys = ['healthexpress-secure-ads-2026', 'HE_GSHEETS_SEC_2026'];
        const token = authHeader?.replace('Bearer ', '').trim();
        
        if (!token || !validKeys.includes(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Try to match surgery by name if provided
        let matchedSurgeryId = null;
        if (data.surgeryName) {
            const surgery = await prisma.surgery.findFirst({
                where: { name: { contains: data.surgeryName, mode: 'insensitive' } }
            });
            if (surgery) {
                matchedSurgeryId = surgery.id;
            }
        }

        // Create the lead in your database
        const lead = await prisma.lead.create({
            data: {
                fullName: data.fullName || data.name || 'Unknown',
                phone: data.phone || data.phoneNumber || 'Unknown',
                email: data.email || null,
                city: data.city || null,
                source: data.source || 'Google Sheets',
                utmSource: data.utmSource || 'google_sheets',
                utmMedium: data.utmMedium || null,
                utmCampaign: data.utmCampaign || null,
                description: data.notes || data.description || (data.surgeryName ? `Surgery Interest: ${data.surgeryName}` : null),
                surgeryId: matchedSurgeryId,
                status: 'NEW',
            }
        });

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
