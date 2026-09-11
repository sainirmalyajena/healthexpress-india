'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Hospital {
    id: string;
    name: string;
    discountPercent: number;
}

interface Lead {
    id: string;
    fullName: string;
    phone: string;
    status: string;
    hospitalId: string | null;
    originalCost: number | null;
    discountedCost: number | null;
    revenue: number | null;
    isEmergency: boolean;
    hasCard: boolean;
    notes?: string | null;
    opdDate?: Date | null;
    followUpDate?: Date | null;
    assignedUserId?: string | null;
    hospital?: { name: string } | null;
    surgery: { name: string } | null;
}

interface CaseManagerModalProps {
    onUpdate?: (id: string, data: any) => void;
    lead: Lead;
    hospitals: Hospital[];
    teamMembers: { id: string, name: string }[];
    onClose: () => void;
}

export default function CaseManagerModal({ lead, hospitals, teamMembers, onClose }: CaseManagerModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [hospitalId, setHospitalId] = useState(lead.hospitalId || '');
    const [originalCost, setOriginalCost] = useState(lead.originalCost || 0);
    const [isEmergency, setIsEmergency] = useState(lead.isEmergency);
    const [hasCard, setHasCard] = useState(lead.hasCard);
    const [status, setStatus] = useState(lead.status);
    const [assignedUserId, setAssignedUserId] = useState(lead.assignedUserId || '');
    const [notes, setNotes] = useState(lead.notes || '');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Format dates for date input fields (YYYY-MM-DD)
    const formatDateForInput = (dateObj?: Date | null) => {
        if (!dateObj) return '';
        return new Date(dateObj).toISOString().split('T')[0];
    };

    
    const formatDateTimeForInput = (dateObj?: Date | null) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    };
const [opdDate, setOpdDate] = useState(formatDateTimeForInput(lead.opdDate));
    const [followUpDate, setFollowUpDate] = useState(formatDateTimeForInput(lead.followUpDate));

    const handleSave = async () => {
        const noFollowUpNeeded = ['NEW', 'LOST', 'CLOSED'].includes(status);
        if (!noFollowUpNeeded && !followUpDate) {
            setError('A Follow-up Date and Time is mandatory when status is ' + status.replace('_', ' ') + '.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const response = await fetch(`/api/dashboard/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    hospitalId: hospitalId || null,
                    originalCost: Number(originalCost),
                    isEmergency,
                    hasCard,
                    notes,
                    opdDate: opdDate || null,
                    followUpDate: followUpDate || null,
                    assignedUserId: assignedUserId || null
                }),
            });

            const data = await response.json();

            if (response.ok) {
                startTransition(() => {
                    // router.refresh() removed for ultimate speed
                    onClose();
                });
            } else {
                setError(data.error || `Save failed (${response.status})`);
            }
        } catch (err) {
            console.error('Failed to update case', err);
            setError('Network error — could not reach server');
        }
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Update Lead: {lead.fullName}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <a href={`tel:${lead.phone}`} className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1">
                                📞 {lead.phone}
                            </a>
                            <a 
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
                                title="Message on WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Status & Hospital */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                                                <option value="FOLLOW_UP">Follow Up</option>
                                <option value="CALL_BACK">Call Back</option>
                                <option value="DNP">DNP (Did Not Pick Up)</option>
                                <option value="OPD_SCHEDULED">OPD Scheduled</option>
                                <option value="OPD_DONE">OPD Done</option>
                                <option value="OPD_RESCHEDULE">OPD Reschedule</option>
                                <option value="SURGERY_SCHEDULED">Surgery Scheduled</option>
                                <option value="SURGERY_DONE">Surgery Done</option>
                                <option value="SURGERY_RESCHEDULE">Surgery Reschedule</option>
                                <option value="LOST">Lost</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Assign Hospital</label>
                            <select
                                value={hospitalId}
                                onChange={e => setHospitalId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">-- Select Hospital --</option>
                                {hospitals.map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Assignment */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Assigned To</label>
                        <select
                            value={assignedUserId}
                            onChange={e => setAssignedUserId(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">-- Unassigned --</option>
                            {(teamMembers || []).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Follow-up Date {!['NEW', 'LOST', 'CLOSED'].includes(status) && <span className="text-red-500">*</span>}</label>
                            <input
                                type="datetime-local"
                                value={followUpDate}
                                onChange={e => setFollowUpDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">OPD Date</label>
                            <input
                                type="datetime-local"
                                value={opdDate}
                                onChange={e => setOpdDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Cost & Economics */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Quoted Cost (₹)</label>
                            <input
                                type="number"
                                value={originalCost}
                                onChange={e => setOriginalCost(Number(e.target.value))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex gap-4 items-end">
                            <label className="flex items-center gap-2 cursor-pointer mt-6">
                                <input type="checkbox" checked={isEmergency} onChange={e => setIsEmergency(e.target.checked)} className="rounded text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-medium text-slate-700">Emergency</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer mt-6">
                                <input type="checkbox" checked={hasCard} onChange={e => setHasCard(e.target.checked)} className="rounded text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-medium text-slate-700">Health Card</span>
                            </label>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Internal Notes & Follow-ups</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={4}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Add details about follow-ups, patient questions, etc."
                        ></textarea>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={saving || isPending}
                        className="px-6 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        {saving || isPending ? 'Saving...' : 'Save Details'}
                    </button>
                </div>
            </div>
        </div>
    );
}
