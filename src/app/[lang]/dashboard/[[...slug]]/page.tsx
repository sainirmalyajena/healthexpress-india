import { redirect, notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LeadStatus, PartnerStatus, Prisma, Category } from '@/generated/prisma';

// Components
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import LeadsTable from '@/components/dashboard/LeadsTable';
import ApprovePartnerButton from '@/components/dashboard/ApprovePartnerButton';
import SetHospitalPasswordButton from '@/components/dashboard/SetHospitalPasswordButton';

// i18n
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDictionary } from '@/get-dictionary';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Locale } from '@/i18n-config';

interface PageProps {
    params: Promise<{ lang: string; slug?: string[] }>;
    searchParams: Promise<{
        range?: string;
        status?: string;
        surgery?: string;
        city?: string;
        page?: string;
        sort?: string;
    }>;
}

// --- Overview Logic ---
async function getAnalytics(range: string = 'all') {
    const where: Prisma.LeadWhereInput = {};
    if (range !== 'all') {
        const now = new Date();
        let startDate = new Date();
        if (range === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        else if (range === 'week') startDate.setDate(now.getDate() - 7);
        else if (range === 'today') startDate.setHours(0, 0, 0, 0);
        where.createdAt = { gte: startDate };
    }

    const leads = await prisma.lead.findMany({
        where,
        include: { surgery: true, hospital: true }
    });

    const totalLeads = leads.length;
    const totalRevenue = leads.reduce((acc, lead) => acc + (lead.revenue || 0), 0);
    const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

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

    const recentLeads = await prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { surgery: true }
    });

    const statusData = Object.entries(leadsByStatus).map(([name, value]) => ({ name, value }));
    const revenueBySurgery = Object.entries(leadsBySurgeryCalc)
        .map(([id]) => {
            const surgery = surgeries.find(s => s.id === id);
            const revenue = leads.filter(l => l.surgeryId === id).reduce((acc, l) => acc + (l.revenue || 0), 0);
            return { name: surgery?.name.substring(0, 15) + '...' || 'Unknown', revenue };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return { totalLeads, totalRevenue, leadsByStatus, leadsBySurgery, recentLeads, revenueBySurgery, statusData };
}

// --- Leads Logic ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getLeads(searchParams: any) {
    const ITEMS_PER_PAGE = 20;
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const where: Prisma.LeadWhereInput = {};

    if (searchParams.status) where.status = searchParams.status as LeadStatus;
    if (searchParams.surgery) where.surgeryId = searchParams.surgery;
    if (searchParams.city) where.city = { contains: searchParams.city };

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            include: { surgery: true, hospital: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: ITEMS_PER_PAGE
        }),
        prisma.lead.count({ where })
    ]);

    const [surgeries, hospitals, citiesData] = await Promise.all([
        prisma.surgery.findMany({ select: { id: true, name: true } }),
        prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } }),
        prisma.lead.findMany({ select: { city: true }, distinct: ['city'], where: { city: { not: undefined } } })
    ]);

    return { leads, total, page, totalPages: Math.ceil(total / ITEMS_PER_PAGE) || 1, surgeries, hospitals, cities: citiesData.map(c => c.city).filter(Boolean) as string[] };
}

// --- Hospitals/Partners Logic ---
async function getHospitals() {
    return prisma.hospital.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { leads: true } } } });
}

async function getPartnerRequests() {
    return prisma.partnerRequest.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
    const session = await getAdminSession();
    const { lang, slug } = await params;
    const sParams = await searchParams;

    if (!session) redirect(`/${lang}/dashboard/login`);

    const view = slug?.[0]; // leads, hospitals, partners, or undefined for overview

    switch (view) {
        case 'leads': {
            const data = await getLeads(sParams);
            const statuses = Object.values(LeadStatus);
            return (
                <DashboardShell userName={session.name || 'Admin'}>
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                                    <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
                                <form action={`/${lang}/dashboard/leads`} method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                        <select name="status" defaultValue={sParams.status || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50">
                                            <option value="">All Statuses</option>
                                            {statuses.map((status) => (<option key={status} value={status}>{status}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Surgery</label>
                                        <select name="surgery" defaultValue={sParams.surgery || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50">
                                            <option value="">All Surgeries</option>
                                            {data.surgeries.map((surgery) => (<option key={surgery.id} value={surgery.id}>{surgery.name}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                        <input type="text" name="city" defaultValue={sParams.city || ''} placeholder="e.g. Pune" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50" />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 transition-all shadow-sm shadow-teal-100">Apply Filters</button>
                                        <Link href={`/${lang}/dashboard/leads`} className="px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">Reset</Link>
                                    </div>
                                </form>
                            </div>
                            <LeadsTable leads={data.leads} hospitals={data.hospitals} statuses={statuses} />
                            {data.totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-sm text-slate-500 font-medium">Page <span className="text-slate-900">{data.page}</span> of {data.totalPages}</p>
                                    <div className="flex gap-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {data.page > 1 && (<Link href={`/${lang}/dashboard/leads?${new URLSearchParams({ ...sParams, page: String(data.page - 1) } as any).toString()}`} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">Previous</Link>)}
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {data.page < data.totalPages && (<Link href={`/${lang}/dashboard/leads?${new URLSearchParams({ ...sParams, page: String(data.page + 1) } as any).toString()}`} className="px-4 py-2 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all shadow-sm shadow-teal-100">Next Page</Link>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DashboardShell>
            );
        }

        case 'hospitals': {
            const hospitals = await getHospitals();
            return (
                <DashboardShell userName={session.name || 'Admin'}>
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                        <Link href={`/${lang}/dashboard/partners`} className="hover:text-teal-600 transition-colors underline decoration-slate-200">Partner Moderation</Link>
                                        <span>/</span>
                                        <span className="font-medium text-slate-900">Approved Hospitals</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-slate-900">Hospital Partners</h1>
                                    <p className="text-sm text-slate-500 mt-1">Manage portal access and track performance for approved hospitals.</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Location</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Email</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Active Leads</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Portal Access</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {hospitals.length === 0 ? (
                                                <tr><td colSpan={5} className="px-6 py-20 text-center"><p className="text-slate-500">No approved hospitals yet.</p></td></tr>
                                            ) : (
                                                hospitals.map((h) => (
                                                    <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4"><p className="font-bold text-slate-900">{h.name}</p></td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{h.city}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{h.email || 'Not set'}</td>
                                                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">{h._count.leads} Leads</span></td>
                                                        <td className="px-6 py-4 text-right"><SetHospitalPasswordButton hospitalId={h.id} hospitalName={h.name} /></td>
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

        case 'partners': {
            const requests = await getPartnerRequests();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const statusColors: any = { PENDING: 'bg-amber-100 text-amber-800 border-amber-200', APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
            return (
                <DashboardShell userName={session.name || 'Admin'}>
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-2xl font-bold text-slate-900">Partner Moderation</h1>
                                        <Link href={`/${lang}/dashboard/hospitals`} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"><span>🏥</span> View Approved Hospitals</Link>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Review and approve hospital partnership requests.</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Person</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {requests.map((req) => (
                                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4"><p className="font-bold text-slate-900">{req.hospitalName}</p><p className="text-xs text-slate-500">{req.city}</p></td>
                                                    <td className="px-6 py-4"><p className="text-sm font-medium text-slate-700">{req.contactPerson}</p><p className="text-xs text-slate-400">{req.phone}</p></td>
                                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border ${statusColors[req.status] || 'bg-slate-100'}`}>{req.status}</span></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {['PENDING', 'UNDER_REVIEW'].includes(req.status) && (<ApprovePartnerButton requestId={req.id} hospitalName={req.hospitalName} />)}
                                                            <button className="p-1 px-2 text-xs font-bold text-slate-400 hover:text-teal-600 border border-slate-200 rounded-lg transition-colors">View</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </DashboardShell>
            );
        }

        default: {
            // Overview (Dashboard Root)
            if (slug && slug.length > 0) notFound(); // Handle invalid slugs like /dashboard/unknown

            const analytics = await getAnalytics(sParams.range);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const statusColors: any = { NEW: 'bg-blue-100 text-blue-800', CONTACTED: 'bg-yellow-100 text-yellow-800', QUALIFIED: 'bg-emerald-100 text-emerald-800', ASSIGNED: 'bg-indigo-100 text-indigo-800', SCHEDULED: 'bg-purple-100 text-purple-800', COMPLETED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-800' };

            return (
                <DashboardShell userName={session.name || 'Admin'}>
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div><h1 className="text-2xl font-bold text-slate-900">Overview</h1><p className="text-sm text-slate-500">Welcome back to the Command Center.</p></div>
                                <Suspense fallback={<div className="h-10 w-40 bg-slate-200 animate-pulse rounded-lg" />}><DateRangeFilter /></Suspense>
                            </div>
                            <AnalyticsCharts revenueData={analytics.revenueBySurgery} statusData={analytics.statusData} conversionData={[]} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-teal-500">
                                    <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                                    <p className="text-3xl font-bold text-slate-900">₹{analytics.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-blue-500">
                                    <p className="text-sm text-slate-500 font-medium">Total Cases</p>
                                    <p className="text-3xl font-bold text-slate-900">{analytics.totalLeads}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-orange-500">
                                    <p className="text-sm text-slate-500 font-medium">Pending Ops</p>
                                    <p className="text-3xl font-bold text-orange-600">{(analytics.leadsByStatus.ASSIGNED || 0) + (analytics.leadsByStatus.SCHEDULED || 0)}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-green-500">
                                    <p className="text-sm text-slate-500 font-medium">Conversion</p>
                                    <p className="text-3xl font-bold text-green-600">{analytics.totalLeads > 0 ? Math.round(((analytics.leadsByStatus.COMPLETED || 0) / analytics.totalLeads) * 100) : 0}%</p>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2><Link href={`/${lang}/dashboard/leads`} className="text-sm text-teal-600 hover:text-teal-700 font-medium">View All →</Link></div>
                                    <div className="divide-y divide-slate-100">
                                        {analytics.recentLeads.map((lead) => (
                                            <div key={lead.id} className="p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div><p className="font-medium text-slate-900">{lead.fullName}</p><p className="text-sm text-slate-500">{lead.surgery.name}</p></div>
                                                    <div className="text-right">
                                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>{lead.status}</span>
                                                        <p className="text-xs text-slate-400 mt-1">{lead.city}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-lg font-semibold text-slate-900 mb-4">Top Surgeries</h2>
                                        {analytics.leadsBySurgery.map((item, i) => (<div key={i} className="flex items-center justify-between mb-2"><span className="text-sm text-slate-600">{item.name}</span><span className="text-sm font-bold text-slate-900">{item.count}</span></div>))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DashboardShell>
            );
        }
    }
}
