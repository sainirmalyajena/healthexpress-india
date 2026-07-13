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
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Doctor</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Qualification</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Experience</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital Affiliation</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {doctors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl mb-4">👨‍⚕️</span>
                                                    <p className="text-slate-500 font-medium">No doctors found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900">{doctor.name}</p>
                                                    <p className="text-xs text-slate-500">{doctor.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {doctor.qualification}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {doctor.experience} Years
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <span className="font-medium">{doctor.hospital?.name || 'Independent'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${doctor.status === 'ACTIVE' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {doctor.status}
                                                    </span>
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
