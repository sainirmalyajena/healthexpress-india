import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ActivityLogPage() {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
        redirect('/dashboard');
    }

    const logs = await prisma.activityLog.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            lead: { select: { fullName: true, id: true, referenceId: true } }
        }
    });

    return (
        <DashboardShell>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Global Audit Log</h1>
                    <p className="text-slate-500 mt-1">Track all status changes, lead assignments, and notes across the CRM.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Team Member</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Details</th>
                                    <th className="px-4 py-3">Lead Patient</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-700">
                                            {log.user?.name || log.user?.email || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {log.actionType.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 truncate max-w-xs" title={log.details || ''}>
                                            {log.details || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-blue-600">
                                            {log.lead ? (
                                                <a href={"/en/dashboard/leads?query=${log.lead.referenceId}"} className="hover:underline">
                                                    {log.lead.fullName || 'View Lead'}
                                                </a>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                            No activity logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}


