import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Activity, AlertTriangle, PhoneCall, Calendar, UserPlus } from 'lucide-react';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus, Prisma } from '@/generated/prisma';
import LeadsTable from '@/components/dashboard/LeadsTable';
import DailyProgressBar from '@/components/dashboard/DailyProgressBar';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { CSVUploader } from '@/components/dashboard/CSVUploader';
import AddLeadModal from '@/components/dashboard/AddLeadModal';

export const dynamic = 'force-dynamic';

interface SearchParams {
    quickFilter?: string;
    query?: string;
    status?: string;
    assignedUserId?: string;
    surgery?: string;
    city?: string;
    page?: string;
}

const ITEMS_PER_PAGE = 20;

async function getLeads(searchParams: SearchParams, userId: string, role: string) {
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const where: Prisma.LeadWhereInput = {};

    if (role === 'team') {
        where.assignedUserId = userId;
    }

    if (searchParams.status) {
        where.status = searchParams.status as LeadStatus;
    }

    if (searchParams.surgery) {
        where.surgeryId = searchParams.surgery;
    }

    if (role !== 'team' && searchParams.assignedUserId) {
        if (searchParams.assignedUserId === 'unassigned') {
            where.assignedUserId = null;
        } else {
            where.assignedUserId = searchParams.assignedUserId;
        }
    }

    
    
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (searchParams.quickFilter) {
        if (searchParams.quickFilter === 'uncontacted') {
            where.status = 'NEW';
        } else if (searchParams.quickFilter === 'overdue') {
            where.status = { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] };
            where.followUpDate = { lt: now };
        } else if (searchParams.quickFilter === 'today_followups') {
            where.status = { notIn: ['CLOSED', 'LOST'] };
            where.followUpDate = { gte: startOfToday, lte: endOfToday };
        } else if (searchParams.quickFilter === 'today_opds') {
            where.opdDate = { gte: startOfToday, lte: endOfToday };
        } else if (searchParams.quickFilter === 'today_surgeries') {
            where.status = 'SURGERY_SCHEDULED';
            // Assuming surgery date is stored somewhere. Wait, Lead doesn't have surgeryDate!
            // Wait, does Lead have surgeryDate? No, just opdDate and followUpDate.
            // If they are SURGERY_SCHEDULED, maybe we just show all of them? Or is there a followUpDate for it?
            // Let's just show all SURGERY_SCHEDULED leads for now if there is no surgeryDate field.
        }
    }

    if (searchParams.query) {
        where.OR = [
            { phone: { contains: searchParams.query, mode: 'insensitive' } },
            { fullName: { contains: searchParams.query, mode: 'insensitive' } },
            { referenceId: { contains: searchParams.query, mode: 'insensitive' } }
        ];
    }

    if (searchParams.city) {
        where.city = {
            contains: searchParams.city
        };
    }

    const leads = await prisma.lead.findMany({
        where,
        include: { surgery: true, hospital: true, assignedUser: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE
    });
    const total = await prisma.lead.count({ where });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

    // Get filter data
    const surgeries = await prisma.surgery.findMany({ select: { id: true, name: true } });
    const hospitals = await prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } });
    const citiesData = await prisma.lead.findMany({ select: { city: true }, distinct: ['city'], where: { city: { not: '' } } });

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
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<SearchParams>;
}) {
    const { lang } = await params;
    const session = await getAdminSession();

    if (!session) {
        redirect('/dashboard/login');
    }

    const searchParamsData = await searchParams;
    let data;
    const statuses = Object.values(LeadStatus);
    
    // Fetch team members for the CSV Uploader assignment dropdown
    const teamMembers = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    
    const surgeries = await prisma.surgery.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    try {
        data = await getLeads(searchParamsData, session.adminId, session.role);
    } catch (error) {
        console.error('Dashboard Error:', error);
        return (
            <div className="min-h-screen bg-red-50 p-8">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Leads</h1>
                    <p className="text-slate-600">Please check the database connection and try again.</p>
                      <div className="mt-4 p-4 bg-red-100 rounded text-sm text-red-800 font-mono text-left overflow-auto">{String(error)}</div>
                </div>
            </div>
        );
    }

    
    
    let uncontactedCount = 0;
    let overdueFollowUps = 0;
    let todaysFollowUps = 0;
    let todaysOpds = 0;

    if (session) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const whereClause = session.role === 'team' ? { assignedUserId: session.adminId } : {};
        
        uncontactedCount = await prisma.lead.count({
            where: { ...whereClause, status: 'NEW' }
        });

        overdueFollowUps = await prisma.lead.count({
            where: {
                ...whereClause,
                status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] },
                followUpDate: { lt: now }
            }
        });

        todaysFollowUps = await prisma.lead.count({
            where: {
                ...whereClause,
                status: { notIn: ['CLOSED', 'LOST'] },
                followUpDate: { gte: startOfToday, lte: endOfToday }
            }
        });
        
        todaysOpds = await prisma.lead.count({
            where: {
                ...whereClause,
                opdDate: { gte: startOfToday, lte: endOfToday }
            }
        });
    }
const { leads, total, totalPages } = data;
    const currentPage = parseInt(searchParamsData.page || '1');

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardShell userName={session.name || 'Admin'} userRole={session.role}>
                <div className="p-4 md:p-8">
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                                <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                            </div>
                            <AddLeadModal surgeries={surgeries} />
                        </div>
                        {session.role !== 'team' && (
                            <div className="w-full max-w-4xl">
                                <CSVUploader teamMembers={teamMembers} />
                            </div>
                        )}
                    </div>

                    
                    
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
                        <form action={`/${lang}/dashboard/leads`} method="GET" className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Phone, Name, or ID"
                                    defaultValue={searchParamsData.query || ''}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                <select
                                    name="status"
                                    defaultValue={searchParamsData.status || ''}
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
                                    defaultValue={searchParamsData.surgery || ''}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                >
                                    <option value="">All Surgeries</option>
                                    {data.surgeries.map((surgery) => (
                                        <option key={surgery.id} value={surgery.id}>{surgery.name}</option>
                                    ))}
                                </select>
                            </div>

                            
                            {session.role !== 'team' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned To</label>
                                    <select
                                        name="assignedUserId"
                                        defaultValue={searchParamsData.assignedUserId || ''}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                    >
                                        <option value="">All Members</option>
                                        <option value="unassigned">-- Unassigned --</option>
                                        {teamMembers.map((member) => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    defaultValue={searchParamsData.city || ''}
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
                                    href={`/${lang}/dashboard/leads`}
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
                        statuses={statuses} teamMembers={teamMembers}
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
                                        href={`/${lang}/dashboard/leads?${new URLSearchParams({
                                            ...searchParamsData,
                                            page: String(data.page - 1),
                                        } as Record<string, string>).toString()}`}
                                        className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {data.page < data.totalPages && (
                                    <Link
                                        href={`/${lang}/dashboard/leads?${new URLSearchParams({
                                            ...searchParamsData,
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
            </DashboardShell>
        </div>
    );
}









