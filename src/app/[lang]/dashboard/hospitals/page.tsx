import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import AddHospitalModal from '@/components/dashboard/AddHospitalModal';

export const dynamic = 'force-dynamic';

export default async function HospitalsManagementPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const hospitals = await prisma.hospital.findMany({
        orderBy: { name: 'asc' },
        include: {
            leads: { select: { status: true } },
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
                        <AddHospitalModal />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Doctor / Contact</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Leads Shared</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">OPDs Booked</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Surgeries Done</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {hospitals.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl mb-4">dY?</span>
                                                    <p className="text-slate-500 font-medium">No partner hospitals found.</p>
                                                    <p className="text-sm text-slate-400 mt-1">Click Add Hospital to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        hospitals.map((hospital) => {
                                            const totalLeads = hospital.leads.length;
                                            const opdsBooked = hospital.leads.filter(l => ['OPD_SCHEDULED', 'OPD_DONE'].includes(l.status)).length;
                                            const surgeries = hospital.leads.filter(l => ['SURGERY_DONE'].includes(l.status)).length;
                                            
                                            return (
                                                <tr key={hospital.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900">{hospital.name}</p>
                                                        <p className="text-sm text-slate-500">{hospital.city}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-slate-700">{hospital.doctors?.[0]?.name || 'No Doctor Listed'}</p>
                                                        <p className="text-xs text-slate-500">{hospital.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">{totalLeads}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-100">{opdsBooked}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">{surgeries}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
