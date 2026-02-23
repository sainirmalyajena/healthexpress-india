import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import SetHospitalPasswordButton from '@/components/dashboard/SetHospitalPasswordButton';
import Link from 'next/link';

async function getHospitals() {
    return prisma.hospital.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { leads: true }
            }
        }
    });
}

export default async function HospitalsManagementPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const hospitals = await getHospitals();

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Link href="/dashboard/partners" className="hover:text-teal-600 transition-colors underline decoration-slate-200">Partner Moderation</Link>
                                <span>/</span>
                                <span className="font-medium text-slate-900">Approved Hospitals</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Hospital Partners</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage portal access and track performance for approved hospitals.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Active Leads</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Portal Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {hospitals.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl mb-4">🏥</span>
                                                    <p className="text-slate-500 font-medium">No approved hospitals yet.</p>
                                                    <p className="text-sm text-slate-400 mt-1">Approve partner requests to see hospitals here.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        hospitals.map((hospital) => (
                                            <tr key={hospital.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900">{hospital.name}</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {hospital.specialties.slice(0, 2).map((s, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {hospital.city}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {hospital.email || <span className="text-slate-400 italic">Not set</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
                                                        {hospital._count.leads} Leads
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <SetHospitalPasswordButton
                                                        hospitalId={hospital.id}
                                                        hospitalName={hospital.name}
                                                    />
                                                </td>
                                            </tr>
                                        ))
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
