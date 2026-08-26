import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { InsuranceOption } from '@/generated/prisma';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        const EXPECTED_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || 'HE_GSHEETS_SEC_2026';
        
        if (authHeader !== \Bearer \ + EXPECTED_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        const { 
            fullName, 
            phone, 
            email, 
            city, 
            surgeryName, 
            notes,
            utmSource 
        } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ error: 'Missing required fields (fullName, phone)' }, { status: 400 });
        }

        let surgeryId = null;
        if (surgeryName) {
            const surgery = await prisma.surgery.findFirst({
                where: { name: { contains: surgeryName, mode: 'insensitive' } }
            });
            if (surgery) surgeryId = surgery.id;
        }

        const newLead = await prisma.lead.create({
            data: {
                fullName,
                phone,
                email: email || null,
                city: city || 'Unknown',
                description: notes || 'Lead imported automatically from Meta/Google Sheets',
                surgeryId,
                insurance: InsuranceOption.NO,
                sourcePage: 'Google Sheets Automation',
                utmSource: utmSource || 'meta_ads',
                status: 'NEW',
            }
        });

        console.log('[AUTOMATION] Triggering WhatsApp message to ' + phone + '...');

        return NextResponse.json({ 
            success: true, 
            message: 'Lead created successfully and follow-up triggered.', 
            leadId: newLead.id 
        }, { status: 201 });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
