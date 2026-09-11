'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStatusColor } from '@/lib/utils';
import LeadStatusSelect from './LeadStatusSelect';
import CaseManagerModal from './CaseManagerModal';
import LogCallModal from './LogCallModal';

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
    const [callLead, setCallLead] = useState<Lead | null>(null);

    // Bulk selection state
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [bulkAssignUser, setBulkAssignUser] = useState<string>('');
    const [isBulkAssigning, setIsBulkAssigning] = useState(false);

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
            {selectedLeads.length > 0 && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-4 flex items-center justify-between">
                    <div className="text-teal-800 font-medium text-sm">
                        {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={bulkAssignUser}
                            onChange={(e) => setBulkAssignUser(e.target.value)}
                            className="text-sm border-teal-200 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 py-1.5 px-3"
                        >
                            <option value="">Assign to Team Member...</option>
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
            )}

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
                                                <a href={`tel:${lead.phone}`} className="text-xs text-teal-600 hover:text-teal-800 hover:underline font-medium">
                                                    📞 {lead.phone}
                                                </a>
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
                                                <Link
                                                    href={`/dashboard/leads/${lead.id}`}
                                                    className="p-1 px-2 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 transition-all shadow-sm"
                                                >
                                                    Open
                                                </Link>
                                                <button
                                                    onClick={() => setCallLead(lead)}
                                                    className="p-1 px-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 transition-all shadow-sm"
                                                >
                                                    Call
                                                </button>
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
            {callLead && (
                <LogCallModal 
                    leadId={callLead.id} 
                    leadName={callLead.fullName} 
                    onClose={() => setCallLead(null)} 
                    onLogged={() => window.location.reload()} 
                />
            )}
        </>
    );
}

