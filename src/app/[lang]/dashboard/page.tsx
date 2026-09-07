import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Users, AlertTriangle, PhoneCall, Calendar, Activity, CheckCircle, UserPlus, Stethoscope } from 'lucide-react';
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
    
    // 1. Total active leads
    const activeLeads = await prisma.lead.count({
        where: { ...whereClause, status: { notIn: ['CLOSED', 'LOST'] } }
    });

    // 2. Uncontacted / New
    const newLeads = await prisma.lead.count({
        where: { ...whereClause, status: 'NEW' }
    });

    // 3. Overdue followups
    const overdueFollowUps = await prisma.lead.count({
        where: {
            ...whereClause,
            status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] },
            followUpDate: { lt: now }
        }
    });

    // 4. Today's followups
    const todaysFollowUps = await prisma.lead.count({
        where: {
            ...whereClause,
            status: { notIn: ['CLOSED', 'LOST'] },
            followUpDate: { gte: startOfToday, lte: endOfToday }
        }
    });

    // 5. OPDs Arriving Today
    const todaysOpds = await prisma.lead.count({
        where: {
            ...whereClause,
            opdDate: { gte: startOfToday, lte: endOfToday }
        }
    });

    // 6. Surgeries Scheduled
    const surgeriesScheduled = await prisma.lead.count({
        where: {
            ...whereClause,
            status: 'SURGERY_SCHEDULED'
        }
    });

    return (
        <DashboardShell userName={session.name || 'Admin'} userRole={session.role}>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Command Center Dashboard</h1>
                    <p className="text-slate-500">Your daily summary and actionable tasks.</p>
                </div>

                {/* Main Action Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    
                    <Link href={`/${lang}/dashboard/leads?quickFilter=overdue`} className="bg-red-50 hover:bg-red-100 transition-colors border border-red-200 p-6 rounded-2xl flex items-center justify-between group">
                        <div>
                            <p className="text-red-900 font-bold uppercase tracking-wider text-sm mb-1">Overdue Follow-ups</p>
                            <p className="text-4xl font-black text-red-600 group-hover:scale-105 transition-transform origin-left">{overdueFollowUps}</p>
                            <p className="text-red-700/80 text-xs mt-2 font-medium">Needs immediate action</p>
                        </div>
                        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                    </Link>

                    <Link href={`/${lang}/dashboard/leads?quickFilter=today_followups`} className="bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200 p-6 rounded-2xl flex items-center justify-between group">
                        <div>
                            <p className="text-amber-900 font-bold uppercase tracking-wider text-sm mb-1">Today's Scheduled Calls</p>
                            <p className="text-4xl font-black text-amber-600 group-hover:scale-105 transition-transform origin-left">{todaysFollowUps}</p>
                            <p className="text-amber-700/80 text-xs mt-2 font-medium">Follow-ups set for today</p>
                        </div>
                        <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-amber-600 shadow-inner">
                            <PhoneCall className="w-8 h-8" />
                        </div>
                    </Link>

                    <Link href={`/${lang}/dashboard/leads?quickFilter=today_opds`} className="bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 p-6 rounded-2xl flex items-center justify-between group">
                        <div>
                            <p className="text-indigo-900 font-bold uppercase tracking-wider text-sm mb-1">OPDs Arriving Today</p>
                            <p className="text-4xl font-black text-indigo-600 group-hover:scale-105 transition-transform origin-left">{todaysOpds}</p>
                            <p className="text-indigo-700/80 text-xs mt-2 font-medium">Scheduled hospital visits</p>
                        </div>
                        <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </Link>

                </div>

                {/* Secondary Metrics */}
                <h2 className="text-lg font-bold text-slate-800 mb-4">Pipeline Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <Link href={`/${lang}/dashboard/leads?quickFilter=uncontacted`} className="bg-white hover:bg-slate-50 transition-colors border border-slate-200 p-5 rounded-xl flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <UserPlus className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-600 text-sm">New / Uncontacted</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800">{newLeads}</span>
                    </Link>

                    <Link href={`/${lang}/dashboard/leads?quickFilter=today_surgeries`} className="bg-white hover:bg-slate-50 transition-colors border border-slate-200 p-5 rounded-xl flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-600 text-sm">Surgeries Scheduled</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800">{surgeriesScheduled}</span>
                    </Link>

                    <Link href={`/${lang}/dashboard/leads`} className="bg-white hover:bg-slate-50 transition-colors border border-slate-200 p-5 rounded-xl flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-600 text-sm">All Active Leads</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800">{activeLeads}</span>
                    </Link>

                </div>

            </div>
        </DashboardShell>
    );
}
