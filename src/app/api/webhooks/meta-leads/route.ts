import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'healthexpress_meta_leads_2026';

// ─── GET: Meta Webhook Verification Challenge ───────────────────────
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Meta Lead Ads Webhook Verified!');
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden', { status: 403 });
}

// ─── POST: Receive Lead Ad Submissions ──────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Meta sends: { object: "page", entry: [{ id, time, changes: [{ field: "leadgen", value: { ... } }] }] }
        if (body.object !== 'page') {
            return NextResponse.json({ received: true });
        }

        const entries = body.entry || [];

        for (const entry of entries) {
            const changes = entry.changes || [];
            for (const change of changes) {
                if (change.field === 'leadgen') {
                    const leadgenId = change.value?.leadgen_id;
                    const formId = change.value?.form_id;
                    const pageId = change.value?.page_id;

                    if (leadgenId) {
                        await processMetaLead(leadgenId, formId, pageId);
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Meta Leads Webhook Error:', error);
        // Always return 200 to Meta so they don't retry endlessly
        return NextResponse.json({ received: true });
    }
}

// ─── Fetch lead details from Graph API & save to CRM ────────────────
async function processMetaLead(leadgenId: string, formId?: string, pageId?: string) {
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

    let name = 'Facebook Lead';
    let phone = '';
    let email = '';
    let city = 'Unknown';
    let surgery = '';
    let rawFields: Record<string, string> = {};

    // If we have a page access token, fetch the actual lead data from Graph API
    if (accessToken) {
        try {
            const graphUrl = `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${accessToken}`;
            const res = await fetch(graphUrl);
            const data = await res.json();

            if (data.field_data) {
                for (const field of data.field_data) {
                    const val = field.values?.[0] || '';
                    rawFields[field.name] = val;

                    const fieldName = field.name.toLowerCase();
                    if (fieldName === 'full_name' || fieldName === 'name') {
                        name = val;
                    } else if (fieldName === 'phone_number' || fieldName === 'phone') {
                        phone = val;
                    } else if (fieldName === 'email') {
                        email = val;
                    } else if (fieldName === 'city') {
                        city = val;
                    } else if (fieldName.includes('surgery') || fieldName.includes('treatment') || fieldName.includes('procedure')) {
                        surgery = val;
                    }
                }
            }
        } catch (graphErr) {
            console.error('Graph API fetch error for leadgen:', leadgenId, graphErr);
        }
    }

    // Phone is mandatory
    if (!phone) {
        if (!accessToken) {
            phone = '+910000000000';
            name = 'Test Lead (Missing Access Token)';
            city = 'System Test';
            console.log('Using fallback test data because token is missing.');
        } else {
            console.warn('Meta lead has no phone number, skipping:', leadgenId);
            return;
        }
    }

    const cleanedPhone = phone.toString().replace(/[^\d+]/g, '');

    // Build notes
    let notes = `[Meta Lead Ads - Direct Webhook]\n`;
    notes += `Leadgen ID: ${leadgenId}\n`;
    if (formId) notes += `Form ID: ${formId}\n`;
    if (pageId) notes += `Page ID: ${pageId}\n`;
    if (Object.keys(rawFields).length > 0) {
        notes += `Fields: ${JSON.stringify(rawFields)}\n`;
    }

    // Match surgery
    let surgeryId: string | null = null;
    if (surgery) {
        const s = await prisma.surgery.findFirst({
            where: { name: { contains: surgery, mode: 'insensitive' } }
        });
        if (s) surgeryId = s.id;
    }

    // Round-robin: assign to the counselor with fewest leads
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

    // Dedup: check if a lead with same phone exists within 30 days
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

        console.log('♻️ Meta Lead updated (dedup):', existingLead.id);
        return;
    }

    // Create new lead
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
            sourcePage: 'Facebook Lead Ads (Direct)',
            utmSource: 'facebook',
            utmCampaign: formId ? `form_${formId}` : 'meta_lead_ads',
            description: 'Imported via Meta Webhook (Real-Time)',
            assignedUserId,
            surgeryId
        }
    });

    console.log('🆕 Meta Lead created:', newLead.id, referenceId);

    // In-app notification for assigned counselor
    if (assignedUserId) {
        await prisma.notification.create({
            data: {
                userId: assignedUserId,
                title: '🔥 New Facebook Lead!',
                message: `${name} (${cleanedPhone}) just submitted a lead form on Facebook. Call within 2 minutes!`,
                type: 'LEAD_ASSIGNED',
                link: '/en/dashboard/leads'
            }
        });
    }

    // Email alert to ops + assigned counselor
    try {
        const { sendEmail, emailTemplates } = await import('@/lib/mailer');

        const adminTemplate = emailTemplates.adminInquiry({
            referenceId,
            fullName: name,
            phone: cleanedPhone,
            email: email || undefined,
            city,
            surgeryName: `Meta Lead Ads${assignedName ? ` → ${assignedName}` : ''}`,
            sourcePage: 'Facebook Lead Ads (Direct Webhook)'
        });

        await sendEmail({
            to: process.env.OPS_EMAIL || 'sai@healthexpressindia.com',
            ...adminTemplate
        });
    } catch (emailErr) {
        console.error('Meta lead email alert error:', emailErr);
    }
}

