import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Link from 'next/link';
import { Phone, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { cleanLeadNotes } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function TasksPage({ params }: { params: Promise<{ lang: string }> }) {
    const session = await getAdminSession();
    const { lang } = await params;

    if (!session) {
        redirect(`/${lang}/dashboard/login`);
    }

    const isTeamMember = session.role === 'TEAM_MEMBER';
    const whereClause = isTeamMember ? { assignedUserId: session.adminId } : {};

    const now = new Date();
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Follow-ups
    const followUps = await prisma.lead.findMany({
        where: {
            ...whereClause,
            followUpDate: { lte: today },
            status: { notIn: ['CLOSED', 'LOST', 'OPD_DONE', 'SURGERY_DONE'] }
        },
        orderBy: { followUpDate: 'asc' },
        include: { hospital: true, surgery: true }
    });

    const endOfTomorrow = new Date();
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    // Get all leads with OPD/IPD recently or soon
    const activeAppointments = await prisma.lead.findMany({
        where: {
            ...whereClause,
            status: { notIn: ['CLOSED', 'LOST'] },
            OR: [
                { opdDate: { gte: startOfYesterday, lte: endOfTomorrow } },
                { ipdDate: { gte: startOfYesterday, lte: endOfTomorrow } }
            ]
        },
        orderBy: { updatedAt: 'desc' },
        include: { hospital: true, surgery: true }
    });

    const mandatoryTasks = [];
    const upcomingOpds = [];

    for (const lead of activeAppointments) {
        let opdScheduled = lead.status === 'OPD_SCHEDULED' || lead.status === 'OPD_RESCHEDULE';
        let ipdScheduled = lead.status === 'SURGERY_SCHEDULED' || lead.status === 'SURGERY_RESCHEDULE' || lead.status === 'TENTATIVE_IPD_DATE';

        if (lead.opdDate && lead.opdDate >= startOfToday && lead.opdDate <= endOfTomorrow && opdScheduled) {
            upcomingOpds.push(lead);
        }

        const checkDates = [];
        if (lead.opdDate) checkDates.push({ type: 'OPD', date: lead.opdDate, isActive: opdScheduled });
        if (lead.ipdDate) checkDates.push({ type: 'IPD', date: lead.ipdDate, isActive: ipdScheduled });

        for (const d of checkDates) {
            const diffHours = (d.date.getTime() - now.getTime()) / (1000 * 60 * 60);
            
            if (diffHours > 0 && diffHours <= 2 && d.isActive) {
                mandatoryTasks.push({ lead, label: `Urgent Pre-${d.type} Call (2h)`, urgency: 'critical', hours: diffHours });
            } else if (diffHours > 2 && diffHours <= 24 && d.isActive) {
                mandatoryTasks.push({ lead, label: `Pre-${d.type} Reminder (24h)`, urgency: 'high', hours: diffHours });
            } else if (diffHours < 0 && diffHours >= -12 && d.isActive) {
                // Wait, if it passed within the last 12 hours and is STILL scheduled, they need to post-follow-up!
                mandatoryTasks.push({ lead, label: `Post-${d.type} Follow-up`, urgency: 'critical', hours: diffHours });
            }
        }
    }

    mandatoryTasks.sort((a, b) => a.hours - b.hours);

    return (
        <DashboardShell userName={session.name} userRole={session.role}>
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daily Tasks</h1>
                    <p className="text-slate-500 mt-1">Focus on what needs your attention today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* MANDATORY ACTION COLUMN */}
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Mandatory Actions
                            </h2>
                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {mandatoryTasks.length} Pending
                            </span>
                        </div>
                        <div className="space-y-4">
                            {mandatoryTasks.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-8">No urgent mandatory tasks!</p>
                            ) : (
                                mandatoryTasks.map((task, i) => (
                                    <div key={i} className={`border rounded-lg p-4 transition-all ${task.urgency === 'critical' ? 'border-red-200 bg-red-50/50 hover:bg-red-50' : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{task.lead.fullName}</h3>
                                                <a href={`tel:${task.lead.phone}`} className="text-sm font-medium text-slate-600 hover:underline block mt-1">
                                                    📞 {task.lead.phone}
                                                </a>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${task.urgency === 'critical' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                                {task.label}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <Link href={`/${lang}/dashboard/${isTeamMember ? 'my-leads' : 'leads'}`} className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50">
                                                Update Status
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

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
                                        {cleanLeadNotes(lead.notes) && (
                                            <div className="mt-3 bg-amber-50 border border-amber-100 p-3 rounded text-sm text-amber-900 whitespace-pre-wrap">
                                                <span className="font-bold block mb-1">Notes:</span>
                                                {cleanLeadNotes(lead.notes)}
                                            </div>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/${lang}/dashboard/${isTeamMember ? 'my-leads' : 'leads'}`} className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-900 flex items-center gap-1">
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
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                                                🏥 {lead.hospital?.name || 'No Hospital Assigned'}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/${lang}/dashboard/${isTeamMember ? 'my-leads' : 'leads'}`} className="text-xs font-bold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-50">
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
