import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import OpdScheduleWidget from '@/components/dashboard/OpdScheduleWidget';
import TeamLeaderboard from '@/components/dashboard/TeamLeaderboard';
import { Users, AlertTriangle, PhoneCall, Calendar, Activity, CheckCircle, UserPlus, Stethoscope, ChevronRight, BarChart3, TrendingUp, PhoneOff, Clock, MapPin, Building2 } from 'lucide-react';
import { Prisma } from '@/generated/prisma';
import { getISTDayRange, getISTPeriodRanges, formatWhatsAppPhone, generateOpdWhatsAppMessage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const session = await getAdminSession();

    if (!session) {
        redirect(`/${lang}/dashboard/login`);
    }

    const now = new Date();
    const { startOfToday, endOfToday, startOfWeek, startOfMonth } = getISTPeriodRanges();

    const istFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const [istMonth, istDay, istYear] = istFormatter.format(now).split('/').map(Number);
    const todayDateStr = `${istYear}-${istMonth.toString().padStart(2, '0')}-${istDay.toString().padStart(2, '0')}`;

    const whereClause: Prisma.LeadWhereInput = session.role === 'team' ? { assignedUserId: session.adminId } : {};
    
    // Run all KPI queries in parallel for massive performance boost
    const [
        activeLeads, newLeads, overdueFollowUps, todaysFollowUps, todaysOpds, totalOpdsTillDate,
        surgeriesScheduled, totalInquiries, opdScheduledCount, surgeryDoneCount, urgentLeads,
        dnpLeads, totalFollowUps, todaysOpdList, opdDoneCount, surgerySuggestedCount
    ] = await Promise.all([
        prisma.lead.count({ where: { ...whereClause, status: { notIn: ['CLOSED', 'LOST'] } } }),
        prisma.lead.count({ where: { ...whereClause, status: 'NEW' } }),
        prisma.lead.count({
            where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } }
        }),
        prisma.lead.count({
            where: { ...whereClause, status: { notIn: ['CLOSED', 'LOST'] }, followUpDate: { gte: startOfToday, lte: endOfToday } }
        }),
        prisma.lead.count({
            where: { ...whereClause, opdDate: { gte: startOfToday, lte: endOfToday } }
        }),
        prisma.lead.count({
            where: {
                ...whereClause,
                OR: [
                    { opdDate: { not: null } },
                    { status: { in: ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE', 'OPD_RESCHEDULE'] } }
                ]
            }
        }),
        prisma.lead.count({
            where: { ...whereClause, status: 'SURGERY_SCHEDULED' }
        }),
        prisma.lead.count({ where: whereClause }),
        prisma.lead.count({
            where: { ...whereClause, status: { in: ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SCHEDULED', 'SURGERY_DONE'] } }
        }),
        prisma.lead.count({
            where: { ...whereClause, status: 'SURGERY_DONE' }
        }),
        prisma.lead.findMany({
            where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { not: null, lte: endOfToday } },
            take: 6,
            orderBy: { followUpDate: 'desc' },
            include: { assignedUser: true, hospital: true, surgery: { select: { name: true } } }
        }),
        prisma.lead.count({ where: { ...whereClause, status: 'DNP' } }),
        prisma.lead.count({ where: { ...whereClause, status: 'FOLLOW_UP' } }),
        prisma.lead.findMany({
            where: { ...whereClause, opdDate: { gte: startOfToday, lte: endOfToday } },
            orderBy: { opdDate: 'asc' },
            take: 50,
            include: { assignedUser: true, hospital: true, surgery: true }
        }),
        prisma.lead.count({ where: { ...whereClause, status: 'OPD_DONE' } }),
        prisma.lead.count({ where: { ...whereClause, status: 'SURGERY_SUGGESTED' } })
    ]);

    const opdConversionRate = totalInquiries ? Math.round((opdScheduledCount / totalInquiries) * 100) : 0;
    const surgeryConversionRate = opdScheduledCount ? Math.round((surgeryDoneCount / opdScheduledCount) * 100) : 0;

    // Team Leaderboard (Only for Admin)
    let teamPerformance: { name: string; todaysBookings: number; totalActive: number; initials: string; }[] = [];
    if (session.role !== 'team') {
        const users = await prisma.user.findMany({
            where: { role: 'team' },
            include: {
                assignedLeads: {
                    select: { status: true, opdDate: true }
                }
            }
        });
        teamPerformance = users.map(user => {
            const todaysBookings = user.assignedLeads.filter(l => l.status === 'OPD_SCHEDULED' && l.opdDate && l.opdDate >= startOfToday && l.opdDate <= endOfToday).length;
            const totalActive = user.assignedLeads.filter(l => !['CLOSED', 'LOST'].includes(l.status)).length;
            return { name: user.name, todaysBookings, totalActive, initials: user.name.slice(0, 2).toUpperCase() };
        }).sort((a, b) => b.todaysBookings - a.todaysBookings || b.totalActive - a.totalActive).slice(0, 4);
    }

    return (
        <DashboardShell userName={session.name || 'Admin'} userRole={session.role}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 bg-slate-50 min-h-full">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                        <p className="text-slate-500 mt-1">Here is what's happening today across your clinic.</p>
                    </div>
                    <Link href={`/${lang}/dashboard/leads`} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2">
                        <Users className="w-4 h-4" /> Go to Full Database
                    </Link>
                </div>

                {/* Compact Stats Ribbon — DNP, Follow-up, OPD Done, Surgery Suggested, Surgery Done */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Link href={`/${lang}/dashboard/leads?status=DNP`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-slate-200 transition-colors"><PhoneOff className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-slate-800 leading-none">{dnpLeads}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">DNP</p>
                        </div>
                    </Link>
                    <Link href={`/${lang}/dashboard/leads?status=FOLLOW_UP`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-purple-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors"><Clock className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-slate-800 leading-none">{totalFollowUps}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Follow-up</p>
                        </div>
                    </Link>
                    <Link href={`/${lang}/dashboard/leads?status=OPD_DONE`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors"><TrendingUp className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-emerald-700 leading-none">{opdDoneCount}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">OPD Done</p>
                        </div>
                    </Link>
                    <Link href={`/${lang}/dashboard/leads?status=SURGERY_SUGGESTED`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-100 transition-colors"><Activity className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-teal-700 leading-none">{surgerySuggestedCount}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Surg Suggested</p>
                        </div>
                    </Link>
                    <Link href={`/${lang}/dashboard/leads?status=SURGERY_DONE`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all flex items-center gap-3 col-span-2 md:col-span-1">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-100 transition-colors"><Stethoscope className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-teal-700 leading-none">{surgeryDoneCount}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Surgery Done</p>
                        </div>
                    </Link>
                </div>

                {/* Primary KPI Grid (6 High-Impact Metric Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* 1. Today's OPDs Booked */}
                    <Link href={`/${lang}/dashboard/leads?quickFilter=today_opds`} className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl shadow-sm border border-indigo-500/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Calendar className="w-6 h-6 text-white" /></div>
                                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">Today</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{todaysOpds}</h3>
                            <p className="font-bold text-indigo-100 tracking-wide text-sm">OPDs Booked Today</p>
                            <p className="text-xs text-indigo-200/80 mt-0.5">Scheduled for today (IST)</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>

                    {/* 2. Total OPDs Booked Till Date */}
                    <Link href={`/${lang}/dashboard/leads?status=OPD_SCHEDULED`} className="group relative overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-700 p-6 rounded-3xl shadow-sm border border-teal-500/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Stethoscope className="w-6 h-6 text-white" /></div>
                                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">All Time</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{totalOpdsTillDate}</h3>
                            <p className="font-bold text-teal-100 tracking-wide text-sm">Total OPDs Booked Till Date</p>
                            <p className="text-xs text-teal-200/80 mt-0.5">All-time OPD consultations</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>

                    {/* 3. Overdue Follow-ups */}
                    <Link href={`/${lang}/dashboard/leads?quickFilter=overdue`} className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-sm border border-red-400/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><AlertTriangle className="w-6 h-6 text-white" /></div>
                                <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{overdueFollowUps}</h3>
                            <p className="font-bold text-red-50 tracking-wide text-sm">Overdue Follow-ups</p>
                            <p className="text-xs text-red-200/80 mt-0.5">Urgent calls pending</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>

                    {/* 4. Today's Scheduled Calls */}
                    <Link href={`/${lang}/dashboard/leads?quickFilter=today_followups`} className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-sm border border-amber-400/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><PhoneCall className="w-6 h-6 text-white" /></div>
                                <ChevronRight className="w-5 h-5 text-amber-100 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{todaysFollowUps}</h3>
                            <p className="font-bold text-amber-50 tracking-wide text-sm">Today's Scheduled Calls</p>
                            <p className="text-xs text-amber-200/80 mt-0.5">Follow-ups set for today</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>

                    {/* 5. New / Uncontacted Leads */}
                    <Link href={`/${lang}/dashboard/leads?status=NEW`} className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-sm border border-blue-400/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><UserPlus className="w-6 h-6 text-white" /></div>
                                <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{newLeads}</h3>
                            <p className="font-bold text-blue-50 tracking-wide text-sm">New / Fresh Leads</p>
                            <p className="text-xs text-blue-200/80 mt-0.5">Awaiting initial outreach</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>

                    {/* 6. Surgeries Scheduled */}
                    <Link href={`/${lang}/dashboard/leads?status=SURGERY_SCHEDULED`} className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-3xl shadow-sm border border-purple-400/50 hover:shadow-md transition-all">
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Activity className="w-6 h-6 text-white" /></div>
                                <ChevronRight className="w-5 h-5 text-purple-200 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-1">{surgeriesScheduled}</h3>
                            <p className="font-bold text-purple-100 tracking-wide text-sm">Surgeries Scheduled</p>
                            <p className="text-xs text-purple-200/80 mt-0.5">High conversion pipeline</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    </Link>
                </div>

                {/* Interactive OPD Schedule & Status Manager (Pick Any Specific Date) */}
                <OpdScheduleWidget
                    initialLeads={todaysOpdList}
                    initialDateStr={todayDateStr}
                    userRole={session.role}
                    lang={lang}
                />

                {/* Secondary Grid (Bottom Row) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Actionable Follow-ups Queue */}
                    <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col ${session.role !== 'team' ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Calling Action Queue</h2>
                                    <p className="text-xs text-slate-500">Scheduled follow-ups needing immediate call</p>
                                </div>
                            </div>
                            <Link href={`/${lang}/dashboard/leads?quickFilter=today_followups`} className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition">
                                View All Due →
                            </Link>
                        </div>
                        
                        {urgentLeads.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 my-auto">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20 text-teal-600" />
                                <p className="font-semibold text-slate-600">All follow-ups completed!</p>
                                <p className="text-xs text-slate-400 mt-1">No pending calls due right now.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-50/80 border-y border-slate-100">
                                        <tr>
                                            <th className="px-3.5 py-3 font-bold rounded-tl-xl">Patient</th>
                                            <th className="px-3.5 py-3 font-bold">Treatment & City</th>
                                            <th className="px-3.5 py-3 font-bold">Scheduled Time</th>
                                            {session.role !== 'team' && <th className="px-3.5 py-3 font-bold">Assigned</th>}
                                            <th className="px-3.5 py-3 font-bold text-right rounded-tr-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {urgentLeads.map((lead) => {
                                            const formattedPhone = formatWhatsAppPhone(lead.phone);
                                            const waMsg = encodeURIComponent(`Hi ${lead.fullName}, this is HealthExpress regarding your inquiry for ${lead.surgery?.name || 'medical consultation'}. We are reaching out for your scheduled follow-up. Please let us know a good time to speak.`);
                                            
                                            return (
                                                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-3.5 py-3.5">
                                                        <p className="font-bold text-slate-900">{lead.fullName}</p>
                                                        <a href={`tel:${lead.phone}`} className="text-xs text-teal-600 hover:underline font-medium">📞 {lead.phone}</a>
                                                    </td>
                                                    <td className="px-3.5 py-3.5">
                                                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md">
                                                            {lead.surgery?.name || 'Consultation'}
                                                        </span>
                                                        {lead.city && (
                                                            <p className="text-[11px] text-slate-400 mt-0.5">{lead.city}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-3.5">
                                                        <span className="text-xs font-bold text-rose-600 block">
                                                            {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
                                                        </span>
                                                    </td>
                                                    {session.role !== 'team' && (
                                                        <td className="px-3.5 py-3.5 text-xs text-slate-600 font-medium">
                                                            {lead.assignedUser?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                                        </td>
                                                    )}
                                                    <td className="px-3.5 py-3.5 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <a
                                                                href={`tel:${lead.phone}`}
                                                                className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors inline-flex items-center gap-1"
                                                            >
                                                                📞 Call
                                                            </a>
                                                            <a
                                                                href={`https://wa.me/${formattedPhone}?text=${waMsg}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                                                                title="Send WhatsApp Follow-up"
                                                            >
                                                                💬 WA
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* High-Impact Team Leaderboard & Workload Balancer */}
                    {session.role !== 'team' && (
                        <div className="lg:col-span-5 flex flex-col">
                            <TeamLeaderboard
                                teamStats={teamStats}
                                userRole={session.role}
                                lang={lang}
                            />
                        </div>
                    )}
                    
                </div>
            </div>
        </DashboardShell>
    );
}
