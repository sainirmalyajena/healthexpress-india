import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';

async function getDoctors() {
    return prisma.doctor.findMany({
        orderBy: { name: 'asc' },
        include: {
            hospital: true
        }
    });
}

import Link from 'next/link';
import DoctorDirectory from '@/components/dashboard/DoctorDirectory';

export default async function DoctorsManagementPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const doctors = await getDoctors();

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Doctors Directory</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage doctors and view their affiliations.</p>
                        </div>
                        <Link
                            href="/dashboard/settings"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 shadow-sm transition-all"
                        >
                            ⚙️ Add &amp; Customise in Settings
                        </Link>
                    </div>

                    <DoctorDirectory doctors={doctors} />
                </div>
            </div>
        </DashboardShell>
    );
}
