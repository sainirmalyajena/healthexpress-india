import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@/generated/prisma';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getStatusColor, formatCurrency } from '@/lib/utils';
import LeadStatusSelect from '@/components/dashboard/LeadStatusSelect';
import ManageCaseButton from '@/components/dashboard/ManageCaseButton';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getLeadDetail(id: string) {
    return prisma.lead.findUnique({
        where: { id },
        include: {
            surgery: true,
            hospital: true,
            assignedUser: true,
            activityLogs: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}

export default async function LeadDetailPage({ params }: PageProps) {
    const session = await getSession();
    if (!session) redirect('/dashboard/login');

    const { id } = await params;
    const [lead, hospitals, teamMembers] = await Promise.all([
        getLeadDetail(id),
        prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true }}),
        prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } })
    ]);

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
                                        <div className="flex items-center gap-3">
                                            <a href={`tel:${lead.phone}`} className="text-teal-600 hover:text-teal-800 hover:underline font-medium text-lg flex items-center gap-2">
                                                📞 {lead.phone}
                                            </a>
                                            <a 
                                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors"
                                                title="Message on WhatsApp"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                                WhatsApp
                                            </a>
                                        </div>
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
                                            <p className="text-xl font-bold text-slate-900">{lead.surgery?.name || 'General Inquiry'}</p>
                                            <p className="text-sm text-teal-600 font-medium">{lead.surgery?.category || ''}</p>
                                        </div>
                                        {lead.surgery && (
                                            <Link
                                                href={`/surgeries/${lead.surgery.slug}`}
                                                className="text-xs font-bold text-teal-600 hover:text-teal-700 underline"
                                                target="_blank"
                                            >
                                                View Public Page ↗
                                            </Link>
                                        )}
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
                                                {lead.surgery?.insuranceLikely ? 'Likely' : 'Maybe'}
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
                        
                        {/* Timeline & Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>??</span> Activity Timeline
                                </h3>
                            </div>
                            <div className="p-6">
                                {(!lead.activityLogs || lead.activityLogs.length === 0) ? (
                                    <p className="text-sm text-slate-500 italic">No activity recorded yet.</p>
                                ) : (
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                        {lead.activityLogs.map((log: any, i: number) => {
                                            let icon = "??";
                                            if (log.actionType === 'STATUS_CHANGED') icon = "??";
                                            if (log.actionType === 'LEAD_ASSIGNED') icon = "??";
                                            
                                            return (
                                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                        {icon}
                                                    </div>
                                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                                            <div className="font-bold text-slate-900 text-sm">{log.actionType.replace('_', ' ')}</div>
                                                            <time className="text-xs text-slate-500 font-medium">{new Date(log.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                                                        </div>
                                                        <div className="text-sm text-slate-600">
                                                            {log.details ? (
                                                                <span className="italic">{log.details.replace(/"/g, '')}</span>
                                                            ) : 'Action performed'}
                                                            <div className="text-xs text-slate-400 mt-2">By: {log.user?.name || 'System'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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

                                    
                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">Assigned To</span>
                                            <span className="font-bold text-slate-900">{lead.assignedUser?.name || 'Unassigned'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">OPD Date</span>
                                            <span className="font-bold text-teal-700">
                                                {lead.opdDate ? new Date(lead.opdDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">Next Follow-up</span>
                                            <span className="font-bold text-orange-600">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Not set'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Ops Team Notes</p>
                                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-slate-700 min-h-[100px] italic">
                                            {lead.notes || 'No internal notes found for this lead.'}
                                        </div>
                                    </div>

                                    <ManageCaseButton lead={lead} hospitals={hospitals} teamMembers={[]} />
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
