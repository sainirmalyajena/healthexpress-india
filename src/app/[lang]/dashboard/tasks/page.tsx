import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Link from 'next/link';
import { Phone, Calendar, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TasksPage({ params }: { params: Promise<{ lang: string }> }) {
    const session = await getAdminSession();
    const { lang } = await params;

    if (!session) {
        redirect(`/${lang}/dashboard/login`);
    }

    // Admins see all tasks, team members see only their assigned tasks
    const isTeamMember = session.role === 'TEAM_MEMBER';
    const whereClause = isTeamMember ? { assignedUserId: session.adminId } : {};

    // 1. Get Follow-up calls due today (or overdue)
    // A follow-up is due if followUpDate <= end of today, and status is not CLOSED/LOST/OPD_DONE/SURGERY_DONE
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const followUps = await prisma.lead.findMany({
        where: {
            ...whereClause,
            followUpDate: { lte: today },
            status: { notIn: ['CLOSED', 'LOST', 'OPD_DONE', 'SURGERY_DONE'] }
        },
        orderBy: { followUpDate: 'asc' },
        include: { hospital: true, surgery: true }
    });

    // 2. Get Upcoming OPDs (Next 48 hours)
    // opdDate >= start of today and <= end of tomorrow
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfTomorrow = new Date();
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const upcomingOpds = await prisma.lead.findMany({
        where: {
            ...whereClause,
            opdDate: { gte: startOfToday, lte: endOfTomorrow },
            status: 'OPD_SCHEDULED'
        },
        orderBy: { opdDate: 'asc' },
        include: { hospital: true, surgery: true }
    });

    return (
        <DashboardShell userName={session.name} userRole={session.role}>
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daily Tasks</h1>
                    <p className="text-slate-500 mt-1">Focus on what needs your attention today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* FOLLOW-UPS COLUMN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-amber-500" />
                                Calls Due Today
                            </h2>
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {followUps.length} Pending
                            </span>
                        </div>

                        <div className="space-y-4">
                            {followUps.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-8">No follow-ups due today! You're all caught up.</p>
                            ) : (
                                followUps.map(lead => (
                                    <div key={lead.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{lead.fullName}</h3>
                                                <a href={`tel:${lead.phone}`} className="text-sm font-medium text-teal-600 hover:underline inline-block mt-1">
                                                    📞 {lead.phone}
                                                </a>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Unknown'}
                                            </span>
                                        </div>
                                        {lead.notes && (
                                            <div className="mt-3 bg-amber-50 border border-amber-100 p-3 rounded text-sm text-amber-900 whitespace-pre-wrap">
                                                <span className="font-bold block mb-1">Notes:</span>
                                                {lead.notes}
                                            </div>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            <Link 
                                                href={`/${lang}/dashboard/${isTeamMember ? 'my-leads' : 'leads'}`} 
                                                className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-900 flex items-center gap-1"
                                            >
                                                Manage Case <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* OPDS COLUMN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-500" />
                                Upcoming OPDs (48h)
                            </h2>
                            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {upcomingOpds.length} Scheduled
                            </span>
                        </div>

                        <div className="space-y-4">
                            {upcomingOpds.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-8">No OPDs scheduled for the next 48 hours.</p>
                            ) : (
                                upcomingOpds.map(lead => (
                                    <div key={lead.id} className="border border-teal-100 rounded-lg p-4 bg-teal-50/30 hover:bg-teal-50/60 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{lead.fullName}</h3>
                                                <a href={`tel:${lead.phone}`} className="text-sm font-medium text-teal-600 hover:underline inline-block mt-1">
                                                    📞 {lead.phone}
                                                </a>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded border border-teal-200 block mb-1">
                                                    {lead.opdDate ? new Date(lead.opdDate).toLocaleDateString() : 'Unknown'}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {lead.opdDate && new Date(lead.opdDate).toDateString() === new Date().toDateString() ? 'Today' : 'Tomorrow'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                                                🏥 {lead.hospital?.name || 'No Hospital Assigned'}
                                            </p>
                                            <p className="text-sm text-slate-700 flex items-center gap-2">
                                                ⚕️ {lead.surgery?.name || 'General Inquiry'}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Link 
                                                href={`/${lang}/dashboard/${isTeamMember ? 'my-leads' : 'leads'}`} 
                                                className="text-xs font-bold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-50"
                                            >
                                                Update Status
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
