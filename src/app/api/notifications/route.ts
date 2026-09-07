import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Sync follow-up reminders
        // Find leads assigned to this user where followUpDate is past due and hasn't been notified yet
        const now = new Date();
        const dueLeads = await prisma.lead.findMany({
            where: {
                assignedUserId: session.adminId,
                followUpDate: { lte: now, not: null },
                followUpNotified: false,
                status: { notIn: ['CLOSED', 'LOST', 'SURGERY_DONE'] }
            }
        });

        if (dueLeads.length > 0) {
            // Create notifications and update leads
            await prisma.$transaction(async (tx) => {
                for (const lead of dueLeads) {
                    await tx.notification.create({
                        data: {
                            userId: session.adminId,
                            title: 'Follow-up Reminder ??',
                            message: `It is time to follow up with ${lead.fullName} (${lead.phone}).`,
                            type: 'REMINDER',
                            link: `/en/dashboard/leads?quickFilter=overdue`
                        }
                    });
                    await tx.lead.update({
                        where: { id: lead.id },
                        data: { followUpNotified: true }
                    });
                }
            });
        }

        // 2. Fetch all unread notifications
        const notifications = await prisma.notification.findMany({
            where: { userId: session.adminId, isRead: false },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Notifications Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        
        if (body.markAllRead) {
            await prisma.notification.updateMany({
                where: { userId: session.adminId, isRead: false },
                data: { isRead: true }
            });
            return NextResponse.json({ success: true });
        }

        if (body.id) {
            await prisma.notification.update({
                where: { id: body.id, userId: session.adminId },
                data: { isRead: true }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
