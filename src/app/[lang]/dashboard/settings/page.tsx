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

    // Fetch team members, doctors, hospitals, and surgeries in parallel
    const [allUsers, rawDoctors, rawHospitals, rawSurgeries] = await Promise.all([
        prisma.user.findMany({
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
        }),
        prisma.doctor.findMany({
            orderBy: { name: 'asc' },
            include: {
                hospital: { select: { id: true, name: true, city: true } },
                surgeries: { select: { id: true, name: true } }
            }
        }),
        prisma.hospital.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { leads: true, doctors: true }
                }
            }
        }),
        prisma.surgery.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    ]);

    const teamMembers = allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        dailyCallQuota: u.dailyCallQuota,
        lastActiveAt: u.lastActiveAt ? u.lastActiveAt.toISOString() : null,
        assignedLeadsCount: u._count.assignedLeads,
    }));

    const doctors = rawDoctors.map(d => ({
        id: d.id,
        name: d.name,
        qualification: d.qualification,
        experience: d.experience,
        about: d.about,
        email: d.email,
        image: d.image,
        status: d.status,
        hospitalId: d.hospitalId,
        hospitalName: d.hospital?.name || 'Independent',
        hospitalCity: d.hospital?.city || '',
        surgeries: d.surgeries.map(s => ({ id: s.id, name: s.name }))
    }));

    const hospitals = rawHospitals.map(h => ({
        id: h.id,
        name: h.name,
        city: h.city,
        specialties: h.specialties,
        discountPercent: h.discountPercent,
        email: h.email,
        status: h.status,
        leadsCount: h._count.leads,
        doctorsCount: h._count.doctors
    }));

    const surgeries = rawSurgeries.map(s => ({
        id: s.id,
        name: s.name
    }));

    return (
        <DashboardShell userName={currentUser.name} userRole={currentUser.role}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <SettingsClient
                    currentUser={currentUser}
                    teamMembers={teamMembers}
                    initialDoctors={doctors}
                    initialHospitals={hospitals}
                    availableSurgeries={surgeries}
                />
            </div>
        </DashboardShell>
    );
}
