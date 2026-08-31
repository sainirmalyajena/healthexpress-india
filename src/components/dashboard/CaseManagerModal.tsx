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
    hospital?: { name: string } | null;
    surgery: { name: string } | null;
}

interface CaseManagerModalProps {
    lead: Lead;
    hospitals: Hospital[];
    onClose: () => void;
}

export default function CaseManagerModal({ lead, hospitals, onClose }: CaseManagerModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [hospitalId, setHospitalId] = useState(lead.hospitalId || '');
    const [originalCost, setOriginalCost] = useState(lead.originalCost || 0);
    const [isEmergency, setIsEmergency] = useState(lead.isEmergency);
    const [hasCard, setHasCard] = useState(lead.hasCard);
    const [status, setStatus] = useState(lead.status);
    const [notes, setNotes] = useState(lead.notes || '');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Format dates for date input fields (YYYY-MM-DD)
    const formatDateForInput = (dateObj?: Date | null) => {
        if (!dateObj) return '';
        return new Date(dateObj).toISOString().split('T')[0];
    };

    const [opdDate, setOpdDate] = useState(formatDateForInput(lead.opdDate));
    const [followUpDate, setFollowUpDate] = useState(formatDateForInput(lead.followUpDate));

    const handleSave = async () => {
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
                    followUpDate: followUpDate || null
                }),
            });

            const data = await response.json();

            if (response.ok) {
                startTransition(() => {
                    router.refresh();
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
                        <a href={`tel:${lead.phone}`} className="text-sm text-teal-600 hover:text-teal-800 font-medium">
                            📞 {lead.phone}
                        </a>
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
                                <option value="OPD_SCHEDULED">OPD Scheduled</option>
                                <option value="OPD_DONE">OPD Done</option>
                                <option value="SURGERY_SCHEDULED">Surgery Scheduled</option>
                                <option value="SURGERY_DONE">Surgery Done</option>
                                <option value="LOST">Lost</option>
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

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Follow-up Date</label>
                            <input
                                type="date"
                                value={followUpDate}
                                onChange={e => setFollowUpDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">OPD Date</label>
                            <input
                                type="date"
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
