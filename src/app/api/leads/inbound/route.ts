import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        // Optional Security: Verify API key so nobody can spam your CRM
        const authHeader = req.headers.get('authorization');
        const validKey = process.env.INBOUND_API_KEY || 'healthexpress-secure-ads-2026';
        
        if (authHeader !== `Bearer ${validKey}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Create the lead in your database
        const lead = await prisma.lead.create({
            data: {
                fullName: data.fullName || data.name || 'Unknown',
                phone: data.phone || data.phoneNumber || 'Unknown',
                email: data.email || null,
                city: data.city || null,
                source: data.source || 'Ad Campaign',
                utmSource: data.utmSource || 'paid_ads',
                utmMedium: data.utmMedium || null,
                utmCampaign: data.utmCampaign || null,
                description: data.description || data.notes || null,
                status: 'NEW',
            }
        });

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
