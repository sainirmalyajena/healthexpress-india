import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferenceId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Expected payload from Zapier:
        // { name, phone, city, surgeryName, source, campaign, formName, rawAnswers, assignedUserId }

        const name = body.name || 'Unknown FB Lead';
        const phone = body.phone;
        const city = body.city || 'Unknown';
        const surgeryName = body.surgeryName || '';
        const source = body.source || 'Facebook/Meta Ads';
        const campaign = body.campaign || '';
        const formName = body.formName || '';
        const rawAnswers = body.rawAnswers || '';
        
        // Clean phone number
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }
        const cleanedPhone = phone.toString().replace(/[^\d+]/g, '');

        let notes = `[Automated Zapier Import]\n`;
        if (formName) notes += `Form: ${formName}\n`;
        if (campaign) notes += `Campaign: ${campaign}\n`;
        if (source) notes += `Platform: ${source}\n`;
        if (rawAnswers) notes += `Details: ${rawAnswers}\n`;

        // Check if surgery exists
        let surgeryId = null;
        if (surgeryName) {
            const s = await prisma.surgery.findFirst({
                where: { name: { contains: surgeryName, mode: 'insensitive' } }
            });
            if (s) surgeryId = s.id;
        }

        // Auto-assign logic (if not provided, default to a team member or admin)
        let assignedUserId = body.assignedUserId || null;
        if (!assignedUserId) {
             const defaultUser = await prisma.user.findFirst({
                 where: { name: { contains: 'amir', mode: 'insensitive' } }
             });
             if (defaultUser) assignedUserId = defaultUser.id;
        }

        // Duplicate check
        const existingLead = await prisma.lead.findFirst({
            where: { phone: { endsWith: cleanedPhone.slice(-10) } }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: 'NEW', // reset to new
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    city: city !== 'Unknown' ? city : existingLead.city,
                    surgeryId: surgeryId || existingLead.surgeryId,
                    assignedUserId: assignedUserId || existingLead.assignedUserId
                }
            });
            return NextResponse.json({ success: true, message: 'Updated existing lead', id: existingLead.id });
        }

        const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        const newLead = await prisma.lead.create({
            data: {
                referenceId,
                fullName: name,
                phone: cleanedPhone,
                city: city,
                status: 'NEW',
                notes: notes,
                sourcePage: formName || 'Facebook Lead Ads',
                utmSource: source,
                utmCampaign: campaign,
                description: 'Imported via Zapier Automation',
                assignedUserId: assignedUserId,
                surgeryId
            }
        });

        if (assignedUserId) {
            await prisma.notification.create({
                data: {
                    userId: assignedUserId,
                    title: 'New Lead Assigned ??',
                    message: `${name} (${cleanedPhone}) from ${source} has been assigned to you.`,
                    type: 'LEAD_ASSIGNED',
                    link: `/en/dashboard/leads`
                }
            });
        }

        return NextResponse.json({ success: true, id: newLead.id, referenceId });

    } catch (error) {
        console.error('Zapier Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
