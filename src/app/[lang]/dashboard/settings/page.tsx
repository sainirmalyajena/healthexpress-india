import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import SettingsClient from '@/components/dashboard/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await getAdminSession();
    if (!session?.adminId) {
        redirect('/en/dashboard/login');
    }

    // Fetch current logged in user details
    const dbUser = await prisma.user.findUnique({
        where: { id: session.adminId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dailyCallQuota: true,
        },
    });

    const currentUser = {
        id: dbUser?.id || session.adminId,
        name: dbUser?.name || session.name,
        email: dbUser?.email || session.email,
        role: dbUser?.role || session.role,
        dailyCallQuota: dbUser?.dailyCallQuota || 50,
    };

    // Fetch all team members for quota management
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dailyCallQuota: true,
            lastActiveAt: true,
            _count: {
                select: { assignedLeads: true },
            },
        },
        orderBy: [
            { role: 'asc' },
            { name: 'asc' }
        ],
    });

    const teamMembers = allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        dailyCallQuota: u.dailyCallQuota,
        lastActiveAt: u.lastActiveAt ? u.lastActiveAt.toISOString() : null,
        assignedLeadsCount: u._count.assignedLeads,
    }));

    return (
        <DashboardShell userName={currentUser.name} userRole={currentUser.role}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <SettingsClient
                    currentUser={currentUser}
                    teamMembers={teamMembers}
                />
            </div>
        </DashboardShell>
    );
}
