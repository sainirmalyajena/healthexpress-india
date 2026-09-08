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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        let discountedCost = undefined;
        let revenue = undefined;

        if (originalCost !== undefined && hospitalId !== undefined && originalCost && hospitalId) {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            if (hospital) {
                const discount = hasCard ? (originalCost * (hospital.discountPercent / 100)) : 0;
                discountedCost = originalCost - discount;
                revenue = discountedCost * 0.15;
            }
        }

        const oldLead = await prisma.lead.findUnique({ where: { id } });
        
        const dataToUpdate: any = {};
        if (status !== undefined) dataToUpdate.status = status as LeadStatus;
        if (hospitalId !== undefined) dataToUpdate.hospitalId = hospitalId || null;
        if (originalCost !== undefined) dataToUpdate.originalCost = originalCost || null;
        if (discountedCost !== undefined) dataToUpdate.discountedCost = discountedCost;
        if (revenue !== undefined) dataToUpdate.revenue = revenue;
        if (isEmergency !== undefined) dataToUpdate.isEmergency = isEmergency;
        if (hasCard !== undefined) dataToUpdate.hasCard = hasCard;
        if (notes !== undefined) dataToUpdate.notes = notes || null;
        if (opdDate !== undefined) dataToUpdate.opdDate = opdDate ? new Date(opdDate) : null;
        if (followUpDate !== undefined) dataToUpdate.followUpDate = followUpDate ? new Date(followUpDate) : null;
        if (assignedUserId !== undefined) dataToUpdate.assignedUserId = assignedUserId || null;

        const logsToCreate: any[] = [];

        if (oldLead && status !== undefined && status !== oldLead.status) {
            logsToCreate.push({
                userId: session.adminId,
                leadId: id,
                actionType: 'STATUS_CHANGED',
                details: JSON.stringify({ from: oldLead.status, to: status })
            });
            if (!oldLead.firstContactedAt) {
                dataToUpdate.firstContactedAt = new Date();
            }
        }

        if (oldLead && assignedUserId !== undefined && assignedUserId !== oldLead.assignedUserId) {
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

        if (oldLead && notes !== undefined && notes !== oldLead.notes) {
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
            await prisma.activityLog.createMany({ data: logsToCreate });
        }

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error: any) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 });
    }
}

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
