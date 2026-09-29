import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Expected payload from Zapier / Make / Integrately:
        // { name, phone, city, surgeryName, source, campaign, formName, rawAnswers, email }

        const name = body.name || body.full_name || 'Facebook Lead';
        const phone = body.phone || body.phone_number;
        const email = body.email || '';
        const city = body.city || 'Unknown';
        const surgeryName = body.surgeryName || body.surgery || '';
        const source = body.source || body.platform || 'Facebook/Meta Ads';
        const campaign = body.campaign || body.ad_name || '';
        const formName = body.formName || body.form_name || '';
        const rawAnswers = body.rawAnswers || '';
        
        // Phone is mandatory
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }
        const cleanedPhone = phone.toString().replace(/[^\d+]/g, '');

        let notes = `[Zapier/Make Auto-Import]\n`;
        if (formName) notes += `Form: ${formName}\n`;
        if (campaign) notes += `Campaign: ${campaign}\n`;
        if (source) notes += `Platform: ${source}\n`;
        if (rawAnswers) notes += `Details: ${rawAnswers}\n`;

        // Match surgery in DB
        let surgeryId: string | null = null;
        if (surgeryName) {
            const s = await prisma.surgery.findFirst({
                where: { name: { contains: surgeryName, mode: 'insensitive' } }
            });
            if (s) surgeryId = s.id;
        }

        // ── Round-robin: assign to least-loaded team counselor ──
        let assignedUserId: string | null = null;
        let assignedName = '';
        try {
            const counselor = await prisma.user.findFirst({
                where: { role: 'team' },
                orderBy: { assignedLeads: { _count: 'asc' } },
                select: { id: true, name: true, email: true }
            });
            if (counselor) {
                assignedUserId = counselor.id;
                assignedName = counselor.name;
            }
        } catch { /* fallback unassigned */ }

        // ── Dedup: check phone within last 30 days ──
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const existingLead = await prisma.lead.findFirst({
            where: {
                phone: { endsWith: cleanedPhone.slice(-10) },
                createdAt: { gte: thirtyDaysAgo }
            }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: 'NEW',
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    city: city !== 'Unknown' ? city : existingLead.city,
                    surgeryId: surgeryId || existingLead.surgeryId,
                    assignedUserId: assignedUserId || existingLead.assignedUserId
                }
            });
            return NextResponse.json({ success: true, message: 'Updated existing lead', id: existingLead.id });
        }

        // ── Create new lead ──
        const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        const newLead = await prisma.lead.create({
            data: {
                referenceId,
                fullName: name,
                phone: cleanedPhone,
                email: email || null,
                city,
                status: 'NEW',
                notes,
                sourcePage: formName || 'Facebook Lead Ads',
                utmSource: source,
                utmCampaign: campaign,
                description: 'Imported via Zapier/Make Automation',
                assignedUserId,
                surgeryId
            }
        });

        // ── In-app notification ──
        if (assignedUserId) {
            await prisma.notification.create({
                data: {
                    userId: assignedUserId,
                    title: '🔥 New Facebook Lead!',
                    message: `${name} (${cleanedPhone}) from ${source} has been assigned to you. Call within 2 minutes!`,
                    type: 'LEAD_ASSIGNED',
                    link: '/en/dashboard/leads'
                }
            });
        }

        // ── Email alert to ops team ──
        try {
            const { sendEmail, emailTemplates } = await import('@/lib/mailer');

            const adminTemplate = emailTemplates.adminInquiry({
                referenceId,
                fullName: name,
                phone: cleanedPhone,
                email: email || undefined,
                city,
                surgeryName: `${source}${assignedName ? ` → ${assignedName}` : ''}`,
                sourcePage: formName || 'Zapier Webhook'
            });

            await sendEmail({
                to: process.env.OPS_EMAIL || 'sai@healthexpressindia.com',
                ...adminTemplate
            });
        } catch (emailErr) {
            console.error('Zapier lead email alert error:', emailErr);
        }

        return NextResponse.json({ success: true, id: newLead.id, referenceId });

    } catch (error) {
        console.error('Zapier Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
