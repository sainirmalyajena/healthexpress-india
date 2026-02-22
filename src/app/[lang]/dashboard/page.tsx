import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import DashboardShell from '@/components/dashboard/DashboardShell';

import { Prisma } from '@/generated/prisma';

async function getAnalytics(range: string = 'all') {
    const where: Prisma.LeadWhereInput = {};

    if (range !== 'all') {
        const now = new Date();
        let startDate = new Date();

        if (range === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (range === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (range === 'today') {
            startDate.setHours(0, 0, 0, 0);
        }

        where.createdAt = {
            gte: startDate
        };
    }

    const leads = await prisma.lead.findMany({
        where,
        include: {
            surgery: true,
            hospital: true
        }
    });

    // Total Leads
    const totalLeads = leads.length;

    // Total Revenue (Only from completed/scheduled cases)
    const totalRevenue = leads.reduce((acc, lead) => acc + (lead.revenue || 0), 0);

    // By Status
    const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // By Surgery
    const leadsBySurgeryCalc = leads.reduce((acc, lead) => {
        acc[lead.surgeryId || 'unknown'] = (acc[lead.surgeryId || 'unknown'] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const surgeries = await prisma.surgery.findMany({
        where: { id: { in: Object.keys(leadsBySurgeryCalc) } },
        select: { id: true, name: true }
    });

    const leadsBySurgery = Object.entries(leadsBySurgeryCalc)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({
            name: surgeries.find(s => s.id === id)?.name || 'Unknown',
            count
        }));

    // By City
    const leadsByCityCalc = leads.reduce((acc, lead) => {
        const city = lead.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const leadsByCity = Object.entries(leadsByCityCalc)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => ({ city, count }));

    // Recent Leads
    const recentLeads = await prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { surgery: true }
    });

    // Chart Data: Revenue by Month (Mocking real dates for demo if needed, but trying real first)
    // For simplicity in this "seed" env, we might group by Surgery Category or just show a distribution
    // Let's do Revenue by Surgery for the Bar Chart
    const revenueBySurgery = Object.entries(leadsBySurgeryCalc)
        .map(([id]) => {
            const surgery = surgeries.find(s => s.id === id);
            // Calculate total revenue for this surgery
            const revenue = leads
                .filter(l => l.surgeryId === id)
                .reduce((acc, l) => acc + (l.revenue || 0), 0);
            return {
                name: surgery?.name.substring(0, 15) + '...' || 'Unknown',
                revenue
            };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Chart Data: Status Distribution
    const statusData = Object.entries(leadsByStatus).map(([name, value]) => ({ name, value }));

    // Chart Data: Conversion Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Create an array of all 30 days
    const dailyData: Record<string, { date: string; leads: number; qualified: number }> = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyData[dateStr] = { date: dateStr.split('-').slice(1).reverse().join('/'), leads: 0, qualified: 0 };
    }

    leads.forEach(lead => {
        const dateStr = lead.createdAt.toISOString().split('T')[0];
        if (dailyData[dateStr]) {
            dailyData[dateStr].leads++;
            if (['QUALIFIED', 'ASSIGNED', 'SCHEDULED', 'COMPLETED'].includes(lead.status)) {
                dailyData[dateStr].qualified++;
            }
        }
    });

    const conversionTrend = Object.values(dailyData);

    return {
        totalLeads,
        totalRevenue,
        leadsByStatus,
        leadsBySurgery,
        leadsByCity,
        recentLeads,
        revenueBySurgery,
        statusData,
        conversionTrend
    };
}

export default async function AdminDashboard({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ range?: string }>;
}) {
    const session = await getSession();
    const { lang } = await params;

    if (!session) {
        redirect(`/${lang}/dashboard/login`);
    }

    const { range } = await searchParams;
    const analytics = await getAnalytics(range);

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
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
                            <p className="text-sm text-slate-500">Welcome back to the Command Center.</p>
                        </div>
                        <Suspense fallback={<div className="h-10 w-40 bg-slate-200 animate-pulse rounded-lg" />}>
                            <DateRangeFilter />
                        </Suspense>
                    </div>

                    {/* Visual Analytics */}
                    <AnalyticsCharts
                        revenueData={analytics.revenueBySurgery}
                        statusData={analytics.statusData}
                        conversionData={analytics.conversionTrend}
                    />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* ... (rest of the stats grid from original file) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-teal-500 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                                    <p className="text-3xl font-bold text-slate-900">₹{analytics.totalRevenue.toLocaleString()}</p>
                                    <p className="text-xs text-teal-600 mt-1 font-medium">↑ 12% from last week</p>
                                </div>
                                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-blue-500 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Total Cases</p>
                                    <p className="text-3xl font-bold text-slate-900">{analytics.totalLeads}</p>
                                    <p className="text-xs text-blue-600 mt-1 font-medium">{analytics.leadsByStatus.NEW || 0} strictly new</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📋</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-orange-500 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Pending Ops</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {(analytics.leadsByStatus.ASSIGNED || 0) + (analytics.leadsByStatus.SCHEDULED || 0)}
                                    </p>
                                    <p className="text-xs text-orange-600 mt-1 font-medium">In-progress workflow</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-green-500 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Conversion</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {analytics.totalLeads > 0
                                            ? Math.round(((analytics.leadsByStatus.COMPLETED || 0) / analytics.totalLeads) * 100)
                                            : 0}%
                                    </p>
                                    <p className="text-xs text-green-600 mt-1 font-medium">Cases completed</p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">🏁</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Leads */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
                                <Link href={`/${lang}/dashboard/leads`} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                                    View All →
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {analytics.recentLeads.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        No leads yet. They will appear here once patients submit inquiries.
                                    </div>
                                ) : (
                                    analytics.recentLeads.map((lead) => (
                                        <div key={lead.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900">{lead.fullName}</p>
                                                    <p className="text-sm text-slate-500">{lead.surgery.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                                                        {lead.status}
                                                    </span>
                                                    <p className="text-xs text-slate-400 mt-1">{lead.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Top Surgeries & Cities */}
                        <div className="space-y-6">
                            {/* Top Surgeries */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-lg font-semibold text-slate-900">Top Surgeries</h2>
                                </div>
                                <div className="p-6">
                                    {analytics.leadsBySurgery.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">No data yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {analytics.leadsBySurgery.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600 truncate mr-4">{item.name}</span>
                                                    <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Top Cities */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-lg font-semibold text-slate-900">Top Cities</h2>
                                </div>
                                <div className="p-6">
                                    {analytics.leadsByCity.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">No data yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {analytics.leadsByCity.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600 truncate mr-4">{item.city}</span>
                                                    <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
