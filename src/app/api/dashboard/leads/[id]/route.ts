import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@/generated/prisma';

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getAdminSession();

    if (!session?.adminId) {
        return NextResponse.json({ error: 'Unauthorized – please log in again' }, { status: 401 });
    }

    const { id } = await props.params;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
        status,
        hospitalId,
        originalCost,
        isEmergency,
        hasCard,
        notes,
        opdDate,
        followUpDate,
        assignedUserId
    } = body;

    try {
        // Calculate revenue if hospital and cost are provided
        let discountedCost = null;
        let revenue = null;

        if (originalCost && hospitalId) {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });

            if (hospital) {
                const discount = hasCard ? (originalCost * (hospital.discountPercent / 100)) : 0;
                discountedCost = originalCost - discount;
                revenue = discountedCost * 0.15; // 15% platform fee
            }
        }

        // Get the old lead to check if status changed or firstContactedAt is missing
        const oldLead = await prisma.lead.findUnique({ where: { id } });
        
        const dataToUpdate: any = {
            ...(status && { status: status as LeadStatus }),
            hospitalId: hospitalId || null,
            originalCost: originalCost || null,
            discountedCost,
            revenue,
            isEmergency: isEmergency ?? false,
            hasCard: hasCard ?? false,
            notes: notes || null,
            opdDate: opdDate ? new Date(opdDate) : null,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            assignedUserId: assignedUserId || null
        };

        // Automatic Activity Logging triggers
        const logsToCreate: any[] = [];

        if (oldLead && status && status !== oldLead.status) {
            logsToCreate.push({
                userId: session.adminId,
                leadId: id,
                actionType: 'STATUS_CHANGED',
                details: JSON.stringify({ from: oldLead.status, to: status })
            });
            // Update first contact if first interaction
            if (!oldLead.firstContactedAt) {
                dataToUpdate.firstContactedAt = new Date();
            }
        }

        if (oldLead && assignedUserId && assignedUserId !== oldLead.assignedUserId) {
            logsToCreate.push({
                userId: session.adminId,
                leadId: id,
                actionType: 'LEAD_ASSIGNED',
                details: JSON.stringify({ to: assignedUserId })
            });
            if (!oldLead.firstContactedAt) {
                dataToUpdate.firstContactedAt = new Date();
            }
        }

        if (oldLead && notes && notes !== oldLead.notes) {
            logsToCreate.push({
                userId: session.adminId,
                leadId: id,
                actionType: 'NOTE_ADDED',
                details: JSON.stringify({ noteSnippet: notes.substring(0, 100) })
            });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: dataToUpdate,
            include: {
                hospital: true,
                surgery: true
            }
        });

        if (logsToCreate.length > 0) {
            // Write to ActivityLog
            await prisma.activityLog.createMany({
                data: logsToCreate
            });
        }

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error: any) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 });
    }
}

// GET /api/dashboard/leads/export – CSV download (id='export' used as route)
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getAdminSession();
    if (!session?.adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    if (id !== 'export') return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const surgery = searchParams.get('surgery');
    const city = searchParams.get('city');

    const where: Record<string, unknown> = {};
    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) where.status = status;
    if (surgery) where.surgeryId = surgery;
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const leads = await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { surgery: { select: { name: true } } },
    });

    const headers = ['Reference ID', 'Full Name', 'Phone', 'Email', 'City', 'Surgery', 'Description', 'Insurance', 'Callback Time', 'Status', 'UTM Source', 'UTM Campaign', 'Created At'];
    const rows = leads.map((lead) => [
        lead.referenceId, lead.fullName, lead.phone, lead.email || '', lead.city,
        lead.surgery?.name || 'General Inquiry', `"${lead.description.replace(/"/g, '""')}"`,
        lead.insurance, lead.callbackTime || '', lead.status,
        lead.utmSource || '', lead.utmCampaign || '', lead.createdAt.toISOString(),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
        },
    });
}
