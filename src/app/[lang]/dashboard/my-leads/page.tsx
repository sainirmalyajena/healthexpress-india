import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getAdminSession } from '@/lib/admin-auth';
import { format } from 'date-fns';
import { Phone, CheckCircle2, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function MyLeadsPage({ params }: { params: Promise<{ lang: string }> }) {
    const session = await getAdminSession();
    const { lang } = await params;

    if (!session || session.role !== 'TEAM_MEMBER') {
        redirect(`/${lang}/dashboard/login`);
    }

    const leads = await prisma.lead.findMany({
        where: { assignedUserId: session.adminId },
        orderBy: { createdAt: 'desc' },
        include: { surgery: true, hospital: true }
    });

    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-800',
        CONTACTED: 'bg-yellow-100 text-yellow-800',
        QUALIFIED: 'bg-emerald-100 text-emerald-800',
        ASSIGNED: 'bg-indigo-100 text-indigo-800',
        SCHEDULED: 'bg-purple-100 text-purple-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CLOSED: 'bg-gray-100 text-gray-800',
    };

    return (
        <DashboardShell userName={session.name || 'Team Member'} userRole="TEAM_MEMBER">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Assigned Leads</h1>
                            <p className="text-sm text-slate-500">Manage your leads and follow-ups.</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {leads.map((lead) => (
                            <div key={lead.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-teal-200 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-slate-900">{lead.fullName}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-slate-100 text-slate-800'}`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 flex flex-col sm:flex-row gap-2 sm:gap-6">
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            {lead.phone}
                                        </span>
                                        <span>
                                            <strong>Added:</strong> {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        {lead.followUpDate && (
                                            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                                                <Clock className="w-4 h-4" />
                                                Follow up: {format(new Date(lead.followUpDate), 'MMM dd')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <a 
                                        href={`tel:${lead.phone}`}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" /> Call Now
                                    </a>
                                </div>
                            </div>
                        ))}
                        {leads.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">No leads assigned</h3>
                                <p className="text-slate-500">You're all caught up! Wait for new leads to be assigned.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

