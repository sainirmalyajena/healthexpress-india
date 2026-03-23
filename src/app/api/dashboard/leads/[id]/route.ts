import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@/generated/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    // Type casting to access custom role property added in auth.ts callbacks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
        status,
        hospitalId,
        originalCost,
        isEmergency,
        hasCard,
        notes
    } = body;

    try {
        // Calculate revenue if hospital and cost are provided
        let discountedCost = originalCost;
        let revenue = null;

        if (originalCost && hospitalId) {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });

            if (hospital) {
                const discount = hasCard ? (originalCost * (hospital.discountPercent / 100)) : 0;
                discountedCost = originalCost - discount;
                revenue = discountedCost * 0.15; // 15% standard commission
            }
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(hospitalId && { hospitalId }),
                ...(originalCost !== undefined && { originalCost }),
                ...(discountedCost !== undefined && { discountedCost }),
                ...(revenue !== undefined && { revenue }),
                ...(isEmergency !== undefined && { isEmergency }),
                ...(hasCard !== undefined && { hasCard }),
                ...(notes !== undefined && { notes }),
            },
            include: {
                hospital: true,
                surgery: true
            }
        });

        // Note: Status update emails (Resend) are currently handled manually or in a dedicated worker
        // if automated status alerts are required, they will be implemented here using the new src/lib/resend.ts

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

// GET /api/dashboard/leads/export — CSV download (id='export' used as route)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
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
        lead.surgery.name, `"${lead.description.replace(/"/g, '""')}"`,
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
