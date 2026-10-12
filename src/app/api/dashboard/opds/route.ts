import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { Prisma, LeadStatus } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const session = await getAdminSession();
    if (!session?.adminId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // YYYY-MM-DD
    const statusParam = searchParams.get('status');

    let targetDate = new Date();
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        const [y, m, d] = dateParam.split('-').map(Number);
        // Create date in IST (+05:30)
        const isoStart = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T00:00:00+05:30`;
        const isoEnd = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T23:59:59.999+05:30`;
        
        const startOfDay = new Date(isoStart);
        const endOfDay = new Date(isoEnd);

        const whereClause: Prisma.LeadWhereInput = {
            ...(session.role === 'team' ? { assignedUserId: session.adminId } : {}),
            opdDate: { gte: startOfDay, lte: endOfDay },
            ...(statusParam && statusParam !== 'ALL' ? { status: statusParam as LeadStatus } : {}),
        };

        const leads = await prisma.lead.findMany({
            where: whereClause,
            orderBy: { opdDate: 'asc' },
            include: {
                assignedUser: { select: { id: true, name: true } },
                hospital: { select: { id: true, name: true, address: true, googleMapsUrl: true } },
                surgery: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json({
            success: true,
            date: dateParam,
            count: leads.length,
            leads,
        });
    }

    // Default to today in IST
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const istParts = formatter.format(now).split('/').map(Number); // [m, d, y]
    const m = istParts[0];
    const d = istParts[1];
    const y = istParts[2];

    const isoStart = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T00:00:00+05:30`;
    const isoEnd = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T23:59:59.999+05:30`;
    const startOfDay = new Date(isoStart);
    const endOfDay = new Date(isoEnd);

    const whereClause: Prisma.LeadWhereInput = {
        ...(session.role === 'team' ? { assignedUserId: session.adminId } : {}),
        opdDate: { gte: startOfDay, lte: endOfDay },
        ...(statusParam && statusParam !== 'ALL' ? { status: statusParam as LeadStatus } : {}),
    };

    const leads = await prisma.lead.findMany({
        where: whereClause,
        orderBy: { opdDate: 'asc' },
        include: {
            assignedUser: { select: { id: true, name: true } },
            hospital: { select: { id: true, name: true, address: true, googleMapsUrl: true } },
            surgery: { select: { id: true, name: true } },
        },
    });

    const dateKey = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

    return NextResponse.json({
        success: true,
        date: dateKey,
        count: leads.length,
        leads,
    });
}
