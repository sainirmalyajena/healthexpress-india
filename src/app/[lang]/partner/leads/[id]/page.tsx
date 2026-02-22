import { prisma } from '@/lib/prisma';
import { getPartnerSession } from '@/lib/partner-auth';
import { notFound, redirect } from 'next/navigation';
import PartnerStatusUpdate from '@/components/partner/PartnerStatusUpdate';
import PartnerDocumentUpload from '@/components/partner/PartnerDocumentUpload';
import Link from 'next/link';

export default async function PartnerLeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getPartnerSession();
    if (!session) redirect('/partner/login');

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            surgery: true,
            documents: {
                orderBy: { createdAt: 'desc' }
            }
        },
    });

    if (!lead || lead.hospitalId !== session.hospitalId) {
        return notFound();
    }

    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700 border-blue-200',
        CONTACTED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        QUALIFIED: 'bg-amber-100 text-amber-700 border-amber-200',
        ASSIGNED: 'bg-purple-100 text-purple-700 border-purple-200',
        SCHEDULED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
        CLOSED: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/partner/dashboard"
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
                    >
                        ←
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-black text-slate-900">{lead.fullName}</h1>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border ${statusColors[lead.status]}`}>
                                {lead.status}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">REF ID: {lead.referenceId}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Patient & Surgery Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Patient Details Card */}
                    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            Case Overview
                        </h2>

                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Surgery Required</p>
                                <p className="text-lg font-black text-slate-900">{lead.surgery.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Location</p>
                                <p className="text-lg font-black text-slate-900">{lead.city}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="text-lg font-black text-slate-900">{lead.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                                <p className="text-lg font-black text-slate-900 truncate">{lead.email || 'Not Provided'}</p>
                            </div>
                        </div>

                        {lead.description && (
                            <div className="mt-8 pt-6 border-t border-slate-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Details / Symptoms</p>
                                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 italic text-slate-700 text-sm">
                                    "{lead.description}"
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Status Update Component */}
                    <PartnerStatusUpdate leadId={lead.id} currentStatus={lead.status} />

                    {/* Coordination Log */}
                    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Coordination Log</h2>
                        <div className="space-y-4">
                            {lead.notes ? (
                                <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed bg-slate-50/30 p-4 rounded-xl border border-slate-100">
                                    {lead.notes}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No historical logs available for this case.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Documentation */}
                <div className="space-y-8">
                    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Documents</h2>
                            <PartnerDocumentUpload leadId={lead.id} />
                        </div>

                        <div className="space-y-3">
                            {lead.documents.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No documents attached</p>
                                </div>
                            ) : (
                                lead.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                                            {doc.type === 'PDF' ? '📄' : '🖼️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-6 leading-relaxed italic">
                            Share medical quotes, diagnostics, and reports directly with the HealthExpress coordination team.
                        </p>
                    </section>

                    {/* Quick Support */}
                    <div className="bg-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-teal-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">🚑</div>
                        <h3 className="font-black text-lg mb-2 relative z-10">Care Coordination</h3>
                        <p className="text-teal-50/80 text-xs mb-6 relative z-10 leading-relaxed font-medium">Looking for more info? Contact your assigned Relationship Manager or use the private clinical hotline.</p>
                        <button className="w-full bg-white text-teal-600 font-black py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-teal-50 transition-all relative z-10">
                            Request Callback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
