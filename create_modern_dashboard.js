const fs = require('fs');

const pageCode = `import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Users, AlertTriangle, PhoneCall, Calendar, Activity, CheckCircle, UserPlus, Stethoscope, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { Prisma } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const session = await getAdminSession();

    if (!session) {
        redirect(\`/\${lang}/dashboard/login\`);
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const whereClause: Prisma.LeadWhereInput = session.role === 'team' ? { assignedUserId: session.adminId } : {};
    
    // Quick Stats
    const activeLeads = await prisma.lead.count({ where: { ...whereClause, status: { notIn: ['CLOSED', 'LOST'] } } });
    const newLeads = await prisma.lead.count({ where: { ...whereClause, status: 'NEW' } });
    const overdueFollowUps = await prisma.lead.count({
        where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } }
    });
    const todaysFollowUps = await prisma.lead.count({
        where: { ...whereClause, status: { notIn: ['CLOSED', 'LOST'] }, followUpDate: { gte: startOfToday, lte: endOfToday } }
    });
    const todaysOpds = await prisma.lead.count({
        where: { ...whereClause, opdDate: { gte: startOfToday, lte: endOfToday } }
    });
    const surgeriesScheduled = await prisma.lead.count({
        where: { ...whereClause, status: 'SURGERY_SCHEDULED' }
    });

    // Funnel Analytics
    const totalInquiries = await prisma.lead.count({ where: whereClause });
    const opdScheduledCount = await prisma.lead.count({
        where: { ...whereClause, status: { in: ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SCHEDULED', 'SURGERY_DONE'] } }
    });
    const surgeryDoneCount = await prisma.lead.count({
        where: { ...whereClause, status: 'SURGERY_DONE' }
    });

    const opdConversionRate = totalInquiries ? Math.round((opdScheduledCount / totalInquiries) * 100) : 0;
    const surgeryConversionRate = opdScheduledCount ? Math.round((surgeryDoneCount / opdScheduledCount) * 100) : 0;

    // Mini Urgent Leads Table
    const urgentLeads = await prisma.lead.findMany({
        where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } },
        take: 5,
        orderBy: { followUpDate: 'asc' },
        include: { assignedUser: true, hospital: true }
    });

    // Team Leaderboard (Only for Admin)
    let teamPerformance = [];
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
            <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-full">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                        <p className="text-slate-500 mt-1">Here is what's happening today across your clinic.</p>
                    </div>
                    <Link href={\`/\${lang}/dashboard/leads\`} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2">
                        <Users className="w-4 h-4" /> Go to Full Database
                    </Link>
                </div>

                {/* Primary Bento Box Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: Actionable KPIs (Spans 8 cols) */}
                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=overdue\`} className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-sm border border-red-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><AlertTriangle className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-5xl font-black mb-1">{overdueFollowUps}</h3>
                                <p className="font-semibold text-red-50 tracking-wide text-sm">Overdue Follow-ups</p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        </Link>

                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=today_followups\`} className="group relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 p-6 rounded-3xl shadow-sm border border-amber-300/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><PhoneCall className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-amber-100 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-5xl font-black mb-1">{todaysFollowUps}</h3>
                                <p className="font-semibold text-amber-50 tracking-wide text-sm">Today's Scheduled Calls</p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-300 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        </Link>

                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=today_opds\`} className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl shadow-sm border border-indigo-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Calendar className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-5xl font-black mb-1">{todaysOpds}</h3>
                                <p className="font-semibold text-indigo-50 tracking-wide text-sm">OPDs Arriving Today</p>
                            </div>
                        </Link>

                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=uncontacted\`} className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-sm border border-blue-400/50 hover:shadow-md transition-all">
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><UserPlus className="w-6 h-6 text-white" /></div>
                                    <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-5xl font-black mb-1">{newLeads}</h3>
                                <p className="font-semibold text-blue-50 tracking-wide text-sm">New / Uncontacted Leads</p>
                            </div>
                        </Link>
                    </div>

                    {/* RIGHT COLUMN: Conversion Funnel (Spans 4 cols) */}
                    <div className="md:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
                            <h2 className="text-lg font-bold text-slate-800">Conversion Funnel</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <div className="relative">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Inquiries</span>
                                    <span className="text-xl font-black text-slate-800">{totalInquiries}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 w-full rounded-full"></div>
                                </div>
                            </div>

                            <div className="relative pl-4 border-l-2 border-emerald-100">
                                <div className="absolute -left-3 top-6 bg-white p-1 rounded-full"><div className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{opdConversionRate}%</div></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">OPDs Scheduled</span>
                                    <span className="text-xl font-black text-emerald-800">{opdScheduledCount}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: \`\${Math.max(5, opdConversionRate)}%\` }}></div>
                                </div>
                            </div>

                            <div className="relative pl-8 border-l-2 border-teal-100">
                                <div className="absolute -left-3 top-6 bg-white p-1 rounded-full"><div className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{surgeryConversionRate}%</div></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Surgeries Done</span>
                                    <span className="text-xl font-black text-teal-800">{surgeryDoneCount}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 rounded-full" style={{ width: \`\${Math.max(5, (surgeryDoneCount/totalInquiries)*100)}%\` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Grid (Bottom Row) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Urgent Leads Mini-Table */}
                    <div className={\`bg-white rounded-3xl shadow-sm border border-slate-200 p-6 \${session.role !== 'team' ? 'md:col-span-8' : 'md:col-span-12'}\`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
                                <h2 className="text-lg font-bold text-slate-800">Urgent Follow-ups</h2>
                            </div>
                            <Link href={\`/\${lang}/dashboard/leads?quickFilter=overdue\`} className="text-sm text-teal-600 font-semibold hover:text-teal-700">View All</Link>
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
                                            <tr key={lead.id} className={\`border-b border-slate-100 hover:bg-slate-50 \${idx === urgentLeads.length -1 ? 'border-b-0' : ''}\`}>
                                                <td className="px-4 py-3 font-bold text-slate-800">{lead.fullName}</td>
                                                <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                                                <td className="px-4 py-3 text-red-600 font-semibold">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleString() : 'N/A'}</td>
                                                {session.role !== 'team' && <td className="px-4 py-3 text-slate-600">{lead.assignedUser?.name || 'Unassigned'}</td>}
                                                <td className="px-4 py-3">
                                                    <a href={\`tel:\${lead.phone}\`} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg font-semibold hover:bg-teal-100 transition-colors">Call</a>
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
                                            <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm \${i === 0 ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-slate-200 text-slate-600'}\`}>
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
`;

fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', pageCode);
