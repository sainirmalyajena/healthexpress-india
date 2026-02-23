import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus, Prisma } from '@/generated/prisma';
import LeadsTable from '@/components/dashboard/LeadsTable';
import DashboardShell from '@/components/dashboard/DashboardShell';

interface SearchParams {
    status?: string;
    surgery?: string;
    city?: string;
    page?: string;
}

const ITEMS_PER_PAGE = 20;

async function getLeads(searchParams: SearchParams) {
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const where: Prisma.LeadWhereInput = {};

    if (searchParams.status) {
        where.status = searchParams.status as LeadStatus;
    }

    if (searchParams.surgery) {
        where.surgeryId = searchParams.surgery;
    }

    if (searchParams.city) {
        where.city = {
            contains: searchParams.city
        };
    }

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            include: {
                surgery: true,
                hospital: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: ITEMS_PER_PAGE
        }),
        prisma.lead.count({ where })
    ]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

    // Get filter data
    const [surgeries, hospitals, citiesData] = await Promise.all([
        prisma.surgery.findMany({ select: { id: true, name: true } }),
        prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } }),
        prisma.lead.findMany({
            select: { city: true },
            distinct: ['city'],
            where: { city: { not: undefined } }
        })
    ]);

    return {
        leads,
        total,
        page,
        totalPages,
        surgeries,
        hospitals,
        cities: citiesData.map(c => c.city).filter(Boolean) as string[],
    };
}

export default async function AdminLeadsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const session = await getAdminSession();

    if (!session) {
        redirect('/dashboard/login');
    }

    const params = await searchParams;
    let data;
    const statuses = Object.values(LeadStatus);

    try {
        data = await getLeads(params);
    } catch (error) {
        console.error('Dashboard Error:', error);
        return (
            <div className="min-h-screen bg-red-50 p-8">
                <h1 className="text-2xl font-bold text-red-800">Error Loading Page</h1>
                <pre className="mt-4 p-4 bg-white rounded shadow text-red-600 overflow-auto">
                    {error instanceof Error ? error.message : String(error)}
                    {'\n\n'}
                    {error instanceof Error ? error.stack : ''}
                </pre>
            </div>
        );
    }

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                            <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
                        <form action="/dashboard/leads" method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                <select
                                    name="status"
                                    defaultValue={params.status || ''}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                >
                                    <option value="">All Statuses</option>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Surgery</label>
                                <select
                                    name="surgery"
                                    defaultValue={params.surgery || ''}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                >
                                    <option value="">All Surgeries</option>
                                    {data.surgeries.map((surgery) => (
                                        <option key={surgery.id} value={surgery.id}>{surgery.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    defaultValue={params.city || ''}
                                    placeholder="e.g. Pune"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                />
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 transition-all shadow-sm shadow-teal-100"
                                >
                                    Apply Filters
                                </button>
                                <Link
                                    href="/dashboard/leads"
                                    className="px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    Reset
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <p className="text-sm font-medium text-slate-600">
                            Found <span className="text-slate-900 font-bold">{data.total}</span> total leads
                        </p>
                    </div>

                    {/* Table */}
                    <LeadsTable
                        leads={data.leads}
                        hospitals={data.hospitals}
                        statuses={statuses}
                    />

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-sm text-slate-500 font-medium">
                                Page <span className="text-slate-900">{data.page}</span> of {data.totalPages}
                            </p>
                            <div className="flex gap-2">
                                {data.page > 1 && (
                                    <Link
                                        href={`/dashboard/leads?${new URLSearchParams({
                                            ...params,
                                            page: String(data.page - 1),
                                        } as Record<string, string>).toString()}`}
                                        className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {data.page < data.totalPages && (
                                    <Link
                                        href={`/dashboard/leads?${new URLSearchParams({
                                            ...params,
                                            page: String(data.page + 1),
                                        } as Record<string, string>).toString()}`}
                                        className="px-4 py-2 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all shadow-sm shadow-teal-100"
                                    >
                                        Next Page
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
