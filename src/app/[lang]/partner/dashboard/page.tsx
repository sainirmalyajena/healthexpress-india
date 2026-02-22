import { prisma } from '@/lib/prisma';
import { getPartnerSession } from '@/lib/partner-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PartnerDashboardPage() {
    const session = await getPartnerSession();

    if (!session) redirect('/partner/login');

    const leads = await prisma.lead.findMany({
        where: {
            hospitalId: session.hospitalId,
        },
        include: {
            surgery: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700 border-blue-200',
        CONTACTED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        QUALIFIED: 'bg-amber-100 text-amber-700 border-amber-200',
        ASSIGNED: 'bg-purple-100 text-purple-700 border-purple-200',
        SCHEDULED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
        CLOSED: 'bg-red-100 text-red-700 border-red-200',
    };

    const stats = {
        total: leads.length,
        active: leads.filter(l => ['ASSIGNED', 'SCHEDULED'].includes(l.status)).length,
        completed: leads.filter(l => l.status === 'COMPLETED').length
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Assigned Patients', value: stats.total, color: 'text-slate-900', icon: '👥' },
                    { label: 'Active Cases', value: stats.active, color: 'text-teal-600', icon: '⚡' },
                    { label: 'Completed Surgeries', value: stats.completed, color: 'text-emerald-600', icon: '✅' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h2 className="text-lg font-bold text-slate-900">Patient Queue</h2>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">{leads.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient / ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Surgery Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-4 opacity-20">📂</span>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No patients assigned yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-slate-50/80 transition-all">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 leading-none mb-1.5">{lead.fullName}</p>
                                            <p className="text-[10px] font-black text-slate-400 tracking-wider">REF ID: {lead.referenceId}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-700 leading-tight">{lead.surgery.name}</p>
                                            <p className="text-[10px] font-bold text-teal-600/70 mt-0.5">{lead.city}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border ${statusColors[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/partner/leads/${lead.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 transition-all active:scale-95"
                                            >
                                                Manage Case
                                                <span className="opacity-50">→</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
