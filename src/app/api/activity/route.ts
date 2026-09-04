import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// POST - Log an activity (call, note, etc.)
export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { leadId, actionType, details } = data;

        const log = await prisma.activityLog.create({
            data: {
                userId: session.adminId,
                leadId: leadId || null,
                actionType,
                details: details || null
            }
        });

        // If this is the first interaction with a lead, set firstContactedAt
        if (leadId && (actionType === 'CALL_LOGGED' || actionType === 'STATUS_CHANGED')) {
            const lead = await prisma.lead.findUnique({ where: { id: leadId } });
            if (lead && !lead.firstContactedAt) {
                await prisma.lead.update({
                    where: { id: leadId },
                    data: { firstContactedAt: new Date() }
                });
            }
        }

        return NextResponse.json({ success: true, logId: log.id }, { status: 201 });
    } catch (error) {
        console.error('Activity log error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET - Fetch activity logs (for admin analytics)
export async function GET(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const today = searchParams.get('today') === 'true';

        const where: Record<string, unknown> = {};
        if (userId) where.userId = userId;
        if (today) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            where.createdAt = { gte: startOfDay };
        }

        const logs = await prisma.activityLog.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
                lead: { select: { fullName: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const callCounts = await prisma.activityLog.groupBy({
            by: ['userId'],
            where: {
                actionType: 'CALL_LOGGED',
                createdAt: { gte: startOfDay }
            },
            _count: { id: true }
        });

        return NextResponse.json({ logs, callCounts });
    } catch (error) {
        console.error('Activity fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

