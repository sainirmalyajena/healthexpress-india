import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import TeamAnalytics from '@/components/dashboard/TeamAnalytics';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const session = await getAdminSession();
    if (!session?.adminId) redirect('/en/dashboard/login');
    if (session.role !== 'admin') redirect('/en/dashboard/leads');

    // Get all team members
    const teamMembers = await prisma.user.findMany({
        where: { role: 'team' },
        select: {
            id: true,
            name: true,
            email: true,
            lastActiveAt: true,
            dailyCallQuota: true,
            _count: { select: { assignedLeads: true } }
        }
    });

    // Get today's activity logs
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayLogs = await prisma.activityLog.findMany({
        where: { createdAt: { gte: startOfDay } },
        include: {
            user: { select: { name: true } },
            lead: { select: { fullName: true, phone: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    // Get today's call counts per user
    const callCounts = await prisma.activityLog.groupBy({
        by: ['userId'],
        where: {
            actionType: 'CALL_LOGGED',
            createdAt: { gte: startOfDay }
        },
        _count: { id: true }
    });

    // Get speed-to-lead data (leads with firstContactedAt)
    const leadsWithContact = await prisma.lead.findMany({
        where: {
            firstContactedAt: { not: null },
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        },
        select: {
            createdAt: true,
            firstContactedAt: true,
            assignedUserId: true
        }
    });

    // Calculate average speed-to-lead per user (in minutes)
    const speedByUser: Record<string, { total: number; count: number }> = {};
    leadsWithContact.forEach((lead) => {
        if (lead.firstContactedAt && lead.assignedUserId) {
            const diffMs = lead.firstContactedAt.getTime() - lead.createdAt.getTime();
            const diffMins = Math.max(0, diffMs / (1000 * 60));
            if (!speedByUser[lead.assignedUserId]) {
                speedByUser[lead.assignedUserId] = { total: 0, count: 0 };
            }
            speedByUser[lead.assignedUserId].total += diffMins;
            speedByUser[lead.assignedUserId].count += 1;
        }
    });

    const callCountMap: Record<string, number> = {};
    callCounts.forEach((c) => {
        callCountMap[c.userId] = c._count.id;
    });

    const speedMap: Record<string, number> = {};
    Object.entries(speedByUser).forEach(([userId, data]) => {
        speedMap[userId] = Math.round(data.total / data.count);
    });

    const serializedTeam = teamMembers.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        lastActiveAt: m.lastActiveAt?.toISOString() || null,
        dailyCallQuota: m.dailyCallQuota,
        totalLeads: m._count.assignedLeads,
        todayCalls: callCountMap[m.id] || 0,
        avgSpeedToLead: speedMap[m.id] || null
    }));

    const serializedLogs = todayLogs.map((l) => ({
        id: l.id,
        userName: l.user.name,
        leadName: l.lead?.fullName || null,
        leadPhone: l.lead?.phone || null,
        actionType: l.actionType,
        details: l.details,
        createdAt: l.createdAt.toISOString()
    }));

    return (
        <DashboardShell userRole="admin" userName={session.name}>
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Team Analytics</h1>
                <p className="text-slate-500 mb-6">Monitor your team performance in real-time</p>
                <TeamAnalytics team={serializedTeam} activityFeed={serializedLogs} />
            </div>
        </DashboardShell>
    );
}
