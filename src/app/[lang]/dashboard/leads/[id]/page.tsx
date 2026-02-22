import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@/generated/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getStatusColor, formatCurrency } from '@/lib/utils';
import LeadStatusSelect from '@/components/dashboard/LeadStatusSelect';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getLeadDetail(id: string) {
    return prisma.lead.findUnique({
        where: { id },
        include: {
            surgery: true,
            hospital: true
        }
    });
}

export default async function LeadDetailPage({ params }: PageProps) {
    const session = await getSession();
    if (!session) redirect('/dashboard/login');

    const { id } = await params;
    const lead = await getLeadDetail(id);

    if (!lead) notFound();

    const statuses = Object.values(LeadStatus);

    return (
        <DashboardShell userName={session.name || 'Admin'}>
            <div className="p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/leads" className="hover:text-teal-600 transition-colors">Leads</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{lead.referenceId}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{lead.fullName}</h1>
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-sm font-bold shadow-sm",
                                    getStatusColor(lead.status)
                                )}>
                                    {lead.status}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-600 font-mono text-sm">{lead.referenceId}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <LeadStatusSelect
                                leadId={lead.id}
                                currentStatus={lead.status}
                                statuses={statuses}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Patient & Surgery Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Patient Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>👤</span> Patient Details
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone Number</p>
                                        <p className="text-slate-900 font-medium">{lead.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email (if provided)</p>
                                        <p className="text-slate-900 font-medium">{lead.email || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">City</p>
                                        <p className="text-slate-900 font-medium">{lead.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Inquiry Date</p>
                                        <p className="text-slate-900 font-medium">
                                            {new Date(lead.createdAt).toLocaleString(undefined, {
                                                dateStyle: 'full',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Surgery Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>🏥</span> Surgery Request
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-xl font-bold text-slate-900">{lead.surgery.name}</p>
                                            <p className="text-sm text-teal-600 font-medium">{lead.surgery.category}</p>
                                        </div>
                                        <Link
                                            href={`/surgeries/${lead.surgery.slug}`}
                                            className="text-xs font-bold text-teal-600 hover:text-teal-700 underline"
                                            target="_blank"
                                        >
                                            View Public Page ↗
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Emergency</p>
                                            <p className={lead.isEmergency ? "text-red-600 font-bold" : "text-slate-400"}>
                                                {lead.isEmergency ? 'YES' : 'NO'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Health Card</p>
                                            <p className={lead.hasCard ? "text-teal-600 font-bold" : "text-slate-400"}>
                                                {lead.hasCard ? 'YES' : 'NO'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Insurance</p>
                                            <p className="text-slate-900 font-bold">
                                                {lead.surgery.insuranceLikely ? 'Likely' : 'Maybe'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Est. Cost</p>
                                            <p className="text-slate-900 font-bold italic">₹20k - ₹80k</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* UTM/Source Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>🔗</span> Marketing Context
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Source</p>
                                        <p className="text-slate-900 font-medium">{lead.utmSource || 'Direct'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Medium</p>
                                        <p className="text-slate-900 font-medium">{lead.utmMedium || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Campaign</p>
                                        <p className="text-slate-900 font-medium">{lead.utmCampaign || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-full">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Landing URL / Page</p>
                                        <p className="text-slate-600 text-sm break-all">{lead.sourcePage || 'Not tracked'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Financials & Admin Controls */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-8">
                                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900">Case Economics</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Hospital</span>
                                        <span className="font-bold text-slate-900">{lead.hospital?.name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Quoted Cost</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(lead.originalCost || 0)}</span>
                                    </div>
                                    <div className="px-3 py-2 bg-emerald-50 rounded-lg flex justify-between items-center text-sm">
                                        <span className="text-emerald-700 font-medium">Our Revenue</span>
                                        <span className="font-black text-emerald-800 text-lg">{formatCurrency(lead.revenue || 0)}</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Ops Team Notes</p>
                                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-slate-700 min-h-[100px] italic">
                                            {lead.notes || 'No internal notes found for this lead.'}
                                        </div>
                                    </div>

                                    <Link
                                        href="/dashboard/leads"
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                    >
                                        Update Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

// Utility for cn (needed since I used it above)
import { cn } from '@/lib/utils';
