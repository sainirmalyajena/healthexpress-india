import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import AddHospitalModal from '@/components/dashboard/AddHospitalModal';
import HospitalDirectory from '@/components/dashboard/HospitalDirectory';

export const dynamic = 'force-dynamic';

export default async function HospitalsManagementPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const hospitals = await prisma.hospital.findMany({
        orderBy: { name: 'asc' },
        include: {
            leads: { 
                select: { 
                    id: true,
                    fullName: true,
                    phone: true,
                    opdDate: true,
                    status: true
                } 
            },
            doctors: true
        }
    });

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Hospital Directory & Analytics</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage partner hospitals and track how many cases you are sharing.</p>
                        </div>
                        {session.role === "admin" && <AddHospitalModal />}
                    </div>

                    {hospitals.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl mb-4">🏥</span>
                                <p className="text-slate-500 font-medium">No partner hospitals found.</p>
                                <p className="text-sm text-slate-400 mt-1">Click Add Hospital to get started.</p>
                            </div>
                        </div>
                    ) : (
                        <HospitalDirectory hospitals={hospitals} />
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
