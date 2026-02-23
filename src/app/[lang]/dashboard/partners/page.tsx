import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { PartnerStatus } from '@/generated/prisma';
import ApprovePartnerButton from '@/components/dashboard/ApprovePartnerButton';
import Link from 'next/link';

async function getPartnerRequests() {
    return prisma.partnerRequest.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export default async function PartnerModerationPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const requests = await getPartnerRequests();

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
        UNDER_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
        APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        REJECTED: 'bg-red-100 text-red-800 border-red-200',
        ONBOARDED: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-slate-900">Partner Moderation</h1>
                                <Link
                                    href="/dashboard/hospitals"
                                    className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <span>🏥</span> View Approved Hospitals
                                </Link>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Review and approve hospital partnership requests.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 Pending Reviews</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital / City</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Person</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Specs</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl mb-4">🏥</span>
                                                    <p className="text-slate-500 font-medium">No partnership requests found.</p>
                                                    <p className="text-sm text-slate-400 mt-1">New requests will appear here after hospitals sign up.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{req.hospitalName}</p>
                                                        <p className="text-xs text-slate-500">{req.city}, {req.state}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">{req.contactPerson}</p>
                                                        <p className="text-xs text-slate-400">{req.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {req.specialties.slice(0, 2).map((s, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {req.specialties.length > 2 && (
                                                            <span className="text-[10px] text-slate-400 font-bold">+{req.specialties.length - 2}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border ${statusColors[req.status]}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {['PENDING', 'UNDER_REVIEW'].includes(req.status) ? (
                                                            <ApprovePartnerButton
                                                                requestId={req.id}
                                                                hospitalName={req.hospitalName}
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400 italic">No Action Needed</span>
                                                        )}
                                                        <button className="p-1 px-2 text-xs font-bold text-slate-400 hover:text-teal-600 border border-slate-200 rounded-lg transition-colors">
                                                            View
                                                        </button>
                                                    </div>
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
