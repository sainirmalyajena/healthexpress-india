import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Users, AlertTriangle, PhoneCall, Calendar, Activity, CheckCircle, UserPlus, Stethoscope, ChevronRight, BarChart3, TrendingUp, PhoneOff, Clock, MapPin, Building2 } from 'lucide-react';
import { Prisma } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const session = await getAdminSession();

    if (!session) {
        redirect(`/${lang}/dashboard/login`);
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const whereClause: Prisma.LeadWhereInput = session.role === 'team' ? { assignedUserId: session.adminId } : {};
    
    // Run all KPI queries in parallel for massive performance boost
    const [
        activeLeads, newLeads, overdueFollowUps, todaysFollowUps, todaysOpds, 
        surgeriesScheduled, totalInquiries, opdScheduledCount, surgeryDoneCount, urgentLeads,
        dnpLeads, totalFollowUps, todaysOpdList, opdDoneCount
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
            where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } },
            take: 5,
            orderBy: { followUpDate: 'asc' },
            include: { assignedUser: true, hospital: true }
        }),
        prisma.lead.count({ where: { ...whereClause, status: 'DNP' } }),
        prisma.lead.count({ where: { ...whereClause, status: 'FOLLOW_UP' } }),
        prisma.lead.findMany({
            where: { ...whereClause, opdDate: { gte: startOfToday, lte: endOfToday } },
            orderBy: { opdDate: 'asc' },
            take: 8,
            include: { assignedUser: true, hospital: true }
        }),
        prisma.lead.count({ where: { ...whereClause, status: 'OPD_DONE' } })
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

                {/* Compact Stats Ribbon — DNP, Follow-up, Active, Conversion */}
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
                    <Link href={`/${lang}/dashboard/leads?quickFilter=active`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-100 transition-colors"><Activity className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-slate-800 leading-none">{activeLeads}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Active</p>
                        </div>
                    </Link>
                    <Link href={`/${lang}/dashboard/leads?status=OPD_DONE`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors"><TrendingUp className="w-4 h-4" /></div>
                        <div>
                            <p className="text-2xl font-black text-emerald-700 leading-none">{opdDoneCount}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">OPD Done</p>
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

                {/* Primary Bento Box Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: Actionable KPIs (Spans 8 cols) */}
                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={`/${lang}/dashboard/leads?quickFilter=overdue`} className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-sm border border-red-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><AlertTriangle className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-1">{overdueFollowUps}</h3>
                                <p className="font-semibold text-red-50 tracking-wide text-sm">Overdue Follow-ups</p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        </Link>

                        <Link href={`/${lang}/dashboard/leads?quickFilter=today_followups`} className="group relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 p-6 rounded-3xl shadow-sm border border-amber-300/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><PhoneCall className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-amber-100 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-1">{todaysFollowUps}</h3>
                                <p className="font-semibold text-amber-50 tracking-wide text-sm">Today's Scheduled Calls</p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-300 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        </Link>

                        <Link href={`/${lang}/dashboard/leads?quickFilter=today_opds`} className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl shadow-sm border border-indigo-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Calendar className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-1">{todaysOpds}</h3>
                                <p className="font-semibold text-indigo-50 tracking-wide text-sm">OPDs Arriving Today</p>
                            </div>
                        </Link>

                        <Link href={`/${lang}/dashboard/leads?status=NEW`} className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-sm border border-blue-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><UserPlus className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-1">{newLeads}</h3>
                                <p className="font-semibold text-blue-50 tracking-wide text-sm">New / Uncontacted Leads</p>
                            </div>
                        </Link>
                    </div>

                    {/* RIGHT COLUMN: Today's OPD Schedule (Spans 4 cols) */}
                    <div className="md:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
                                <h2 className="text-lg font-bold text-slate-800">Today's OPD Schedule</h2>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{todaysOpds} total</span>
                        </div>
                        
                        {todaysOpdList.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
                                <Calendar className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No OPDs scheduled today</p>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-3 overflow-y-auto">
                                {todaysOpdList.map((lead, idx) => (
                                    <Link key={lead.id} href={`/${lang}/dashboard/leads/${lead.id}`} className="group block p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <p className="font-bold text-slate-800 text-sm truncate max-w-[140px]">{lead.fullName}</p>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {lead.opdDate ? new Date(lead.opdDate).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : 'TBD'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {lead.hospital?.name || 'No hospital'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <PhoneCall className="w-3 h-3" />
                                                {lead.phone}
                                            </span>
                                        </div>
                                        {session.role !== 'team' && lead.assignedUser && (
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">Assigned: {lead.assignedUser.name}</p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Grid (Bottom Row) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Urgent Leads Mini-Table */}
                    <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 p-6 ${session.role !== 'team' ? 'md:col-span-8' : 'md:col-span-12'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
                                <h2 className="text-lg font-bold text-slate-800">Urgent Follow-ups</h2>
                            </div>
                            <Link href={`/${lang}/dashboard/leads?quickFilter=overdue`} className="text-sm text-teal-600 font-semibold hover:text-teal-700">View All</Link>
                        </div>
                        
                        {urgentLeads.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>You are all caught up!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold rounded-tl-lg">Patient</th>
                                            <th className="px-4 py-3 font-semibold">Phone</th>
                                            <th className="px-4 py-3 font-semibold">Follow-up Time</th>
                                            {session.role !== 'team' && <th className="px-4 py-3 font-semibold">Assigned To</th>}
                                            <th className="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {urgentLeads.map((lead, idx) => (
                                            <tr key={lead.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx === urgentLeads.length -1 ? 'border-b-0' : ''}`}>
                                                <td className="px-4 py-3 font-bold text-slate-800">{lead.fullName}</td>
                                                <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                                                <td className="px-4 py-3 text-red-600 font-semibold">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}</td>
                                                {session.role !== 'team' && <td className="px-4 py-3 text-slate-600">{lead.assignedUser?.name || 'Unassigned'}</td>}
                                                <td className="px-4 py-3">
                                                    <a href={`tel:${lead.phone}`} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg font-semibold hover:bg-teal-100 transition-colors">Call</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Team Leaderboard */}
                    {session.role !== 'team' && (
                        <div className="md:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><BarChart3 className="w-5 h-5" /></div>
                                    <h2 className="text-lg font-bold text-slate-800">Team Performance</h2>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {teamPerformance.map((member, i) => (
                                    <div key={member.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-slate-200 text-slate-600'}`}>
                                                {member.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.totalActive} active leads</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-indigo-600">{member.todaysBookings}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today OPDs</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </DashboardShell>
    );
}
