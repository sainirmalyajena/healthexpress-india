'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStatusColor } from '@/lib/utils';
import LeadStatusSelect from './LeadStatusSelect';
import CaseManagerModal from './CaseManagerModal';

interface Lead {
    id: string;
    referenceId: string;
    fullName: string;
    phone: string;
    city: string;
    status: string;
    createdAt: Date | string;
    surgery: {
        name: string;
    } | null;
    hospital?: {
        name: string;
    } | null;
    hospitalId: string | null;
    revenue: number | null;
    originalCost: number | null;
    discountedCost: number | null;
    isEmergency: boolean;
    hasCard: boolean;
    utmSource: string | null;
    utmCampaign: string | null;
    notes: string | null;
    opdDate?: Date | string | null;
    ipdDate?: Date | string | null;
    followUpDate?: Date | string | null;
    assignedUserId: string | null;
    assignedUser?: {
        name: string;
    } | null;
}

interface LeadsTableProps {
    leads: Lead[];
    statuses: string[];
    hospitals: { id: string, name: string, discountPercent: number }[];
    teamMembers: { id: string, name: string }[];
}

export default function LeadsTable({ leads, statuses, hospitals, teamMembers }: LeadsTableProps) {
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    useEffect(() => { setLocalLeads(leads); }, [leads]);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Bulk selection state
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [bulkAssignUser, setBulkAssignUser] = useState<string>('');
    const [isBulkAssigning, setIsBulkAssigning] = useState(false);
    const [callingLeadId, setCallingLeadId] = useState<string | null>(null);

    const handleAiCall = async (lead: Lead) => {
        if (!window.confirm(
            `🤖 Trigger Bland AI Voice Call to ${lead.fullName} (${lead.phone})?\n\n` +
            `⚠️ COST NOTICE: Bland AI charges ~$0.09 (₹7.50) per minute from your Bland balance.\n` +
            `Your current account balance is ~$1.96 (~15-20 minutes total).\n\n` +
            `Sarah (AI Voice Receptionist) will dial the patient, inquire about their "${lead.surgery?.name || 'medical consultation'}", and attempt to book an appointment automatically.\n\n` +
            `Do you want to proceed with this call?`
        )) {
            return;
        }

        setCallingLeadId(lead.id);
        try {
            const res = await fetch('/api/ai/call-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: lead.fullName,
                    patientPhone: lead.phone,
                    reason: lead.surgery?.name || 'medical consultation'
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`✅ AI Call initiated! Sarah (Bland AI) is calling ${lead.fullName} now. (Call ID: ${data.callId || 'active'})`);
            } else {
                const errorMsg = data.message || data.error || 'Check Bland AI configuration';
                if (errorMsg.toLowerCase().includes('international calling requires a completed purchase')) {
                    alert(`❌ Bland AI Notice: International calls to Indian (+91) numbers are locked on trial accounts.\n\nTo unlock AI calling to India:\n1. Log into your Bland AI dashboard at https://app.bland.ai\n2. Go to Billing and make a minimum $10 credit purchase.\n\n💡 In the meantime, you can message ${lead.fullName} directly for ₹0 using the green WhatsApp button!`);
                } else {
                    alert(`❌ AI Call failed: ${errorMsg}`);
                }
            }
        } catch (err: any) {
            alert(`❌ AI Call error: ${err.message}`);
        } finally {
            setCallingLeadId(null);
        }
    };

    const handleExportCSV = (targetLeads: Lead[]) => {
        if (targetLeads.length === 0) {
            alert('No leads to export.');
            return;
        }
        const headers = ['Full Name', 'Phone', 'City', 'Surgery', 'Status', 'Notes', 'Created At'];
        const rows = targetLeads.map(l => [
            `"${(l.fullName || '').replace(/"/g, '""')}"`,
            `"${l.phone || ''}"`,
            `"${(l.city || '').replace(/"/g, '""')}"`,
            `"${(l.surgery?.name || 'General Inquiry').replace(/"/g, '""')}"`,
            `"${l.status || ''}"`,
            `"${(l.notes || '').replace(/"/g, '""')}"`,
            `"${new Date(l.createdAt).toLocaleDateString('en-IN')}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `healthexpress_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportVCF = (targetLeads: Lead[]) => {
        if (targetLeads.length === 0) {
            alert('No leads to export.');
            return;
        }
        const vcards = targetLeads.map(l => {
            const cleanPhone = l.phone.replace(/[^0-9]/g, '');
            const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
            const surgery = l.surgery?.name ? ` (${l.surgery.name})` : '';
            return [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:HE - ${l.fullName}${surgery}`,
                `TEL;TYPE=CELL:${formattedPhone}`,
                `NOTE:HealthExpress Lead | City: ${l.city || 'N/A'} | Status: ${l.status}`,
                'END:VCARD'
            ].join('\n');
        }).join('\n\n');

        const blob = new Blob([vcards], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `healthexpress_contacts_${new Date().toISOString().slice(0, 10)}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
        
        try {
            const res = await fetch(`/api/dashboard/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLocalLeads(prev => prev.filter(l => l.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete lead');
            }
        } catch (error) {
            console.error('Failed to delete lead:', error);
            alert('An error occurred while deleting.');
        }
    };

    const handleModalUpdate = (id: string, data: any) => {
        setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLeads(localLeads.map(l => l.id));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedLeads(prev => 
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const handleBulkAssign = async () => {
        if (!bulkAssignUser || selectedLeads.length === 0) return;
        setIsBulkAssigning(true);
        try {
            await Promise.all(
                selectedLeads.map(id => 
                    fetch(`/api/dashboard/leads/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ assignedUserId: bulkAssignUser })
                    })
                )
            );
            window.location.reload();
        } catch (error) {
            console.error('Failed to bulk assign', error);
            setIsBulkAssigning(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {selectedLeads.length > 0 ? (
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 w-full flex flex-wrap items-center justify-between gap-3">
                        <div className="text-teal-800 font-medium text-sm">
                            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleExportCSV(localLeads.filter(l => selectedLeads.includes(l.id)))}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                                title="Export selected leads to CSV"
                            >
                                📊 Export Selected CSV
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExportVCF(localLeads.filter(l => selectedLeads.includes(l.id)))}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                                title="Import selected leads to phone contacts for WhatsApp broadcast"
                            >
                                📇 Export Phone Contacts (.vcf)
                            </button>
                            <select
                                value={bulkAssignUser}
                                onChange={(e) => setBulkAssignUser(e.target.value)}
                                className="text-sm border-teal-200 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 py-1.5 px-3"
                            >
                                <option value="">Assign to...</option>
                                {teamMembers.map(tm => (
                                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleBulkAssign}
                                disabled={!bulkAssignUser || isBulkAssigning}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                            >
                                {isBulkAssigning ? 'Assigning...' : 'Apply'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-slate-500">
                            Total Leads: <span className="font-semibold text-slate-700">{localLeads.length}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleExportCSV(localLeads)}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                                title="Export all leads to CSV"
                            >
                                📊 Export All CSV
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExportVCF(localLeads)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                                title="Export all contacts to VCF file for phone / WhatsApp broadcast"
                            >
                                📇 Export All Contacts (.vcf)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left w-12">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                                        checked={selectedLeads.length === leads.length && leads.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date Added</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Surgery</th>
                                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">City</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assigned To</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {localLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                                        No leads found. Adjust your filters or wait for new inquiries.
                                    </td>
                                </tr>
                            ) : (
                                localLeads.map((lead) => (
                                    <tr key={lead.id} className={`transition-colors ${selectedLeads.includes(lead.id) ? 'bg-teal-50/30' : 'hover:bg-slate-50'}`}>
                                        <td className="px-4 py-3">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => handleSelectOne(lead.id)}
                                            />
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-3">
                                            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{new Date(lead.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-slate-900">{lead.fullName}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <a href={`tel:${lead.phone}`} className="text-xs text-teal-600 hover:text-teal-800 hover:underline font-medium flex items-center gap-1">
                                                        📞 {lead.phone}
                                                    </a>
                                                    {(() => {
                                                        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                                                        const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                                        const msg = encodeURIComponent(
                                                            `Hi ${lead.fullName}, this is HealthExpress India regarding your inquiry for ${lead.surgery?.name || 'medical consultation'}. We have NABH partner hospitals in ${lead.city || 'your city'} with 100% cashless insurance & 0% EMI. Would you like to check the cost estimate or book a ₹0 doctor OPD consultation?`
                                                        );
                                                        return (
                                                            <a 
                                                                href={`https://wa.me/${formattedPhone}?text=${msg}`}
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                                                                title="Send prefilled consultation message on WhatsApp"
                                                            >
                                                                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                                                WhatsApp
                                                            </a>
                                                        );
                                                    })()}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAiCall(lead)}
                                                        disabled={callingLeadId === lead.id}
                                                        className="text-xs text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 transition-colors disabled:opacity-50"
                                                        title="Trigger automated AI Voice Receptionist to call this patient"
                                                    >
                                                        {callingLeadId === lead.id ? '⏳ Calling...' : '🤖 AI Call'}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-4 py-3 text-sm text-slate-700">{lead.surgery?.name || 'General Inquiry'}</td>
                                        <td className="hidden sm:table-cell px-4 py-3 text-sm text-slate-700">{lead.city}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                                {/* Stale Indicator: > 48 hours and still NEW/CONTACTED */}
                                                {['NEW', 'CONTACTED'].includes(lead.status) &&
                                                    (new Date().getTime() - new Date(lead.createdAt).getTime()) > (48 * 60 * 60 * 1000) && (
                                                        <span className="flex h-2 w-2 relative" title="Stale Lead (>48h)">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="hidden xl:table-cell px-4 py-3 text-sm text-slate-700">
                                            {/* @ts-ignore */}
                                            {lead.assignedUser ? (
                                                <span className="text-indigo-600 font-semibold">{lead.assignedUser.name}</span>
                                            ) : (
                                                <span className="text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <LeadStatusSelect
                                                    leadId={lead.id}
                                                    currentStatus={lead.status || 'NEW'}
                                                    statuses={statuses}
                                                />
                                                {lead.status === 'FOLLOW_UP' && lead.followUpDate && (
                                                    <div className="text-[10px] font-semibold text-slate-500 mt-1 whitespace-nowrap bg-amber-50 px-2 py-0.5 rounded border border-amber-100 w-max">
                                                        {new Date(lead.followUpDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    </div>
                                                )}
                                                {lead.status === 'OPD_SCHEDULED' && lead.opdDate && (
                                                    <div className="text-[10px] font-semibold text-slate-500 mt-1 whitespace-nowrap bg-teal-50 px-2 py-0.5 rounded border border-teal-100 w-max">
                                                        {new Date(lead.opdDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/dashboard/leads/${lead.id}`}
                                                    className="p-1 px-2 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 transition-all shadow-sm"
                                                >
                                                    Open
                                                </Link>
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="p-1 px-2 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded hover:bg-teal-100 transition-all shadow-sm"
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-1 px-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition-all shadow-sm"
                                                    title="Delete Lead"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedLead && (
                <CaseManagerModal
                    lead={selectedLead}
                    hospitals={hospitals} teamMembers={teamMembers}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </>
    );
}


