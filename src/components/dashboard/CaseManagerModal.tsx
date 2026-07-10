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
    status: string;
    hospitalId: string | null;
    originalCost: number | null;
    discountedCost: number | null;
    revenue: number | null;
    isEmergency: boolean;
    hasCard: boolean;
    notes?: string | null;
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

    const selectedHospital = hospitals.find(h => h.id === hospitalId);
    const discount = hasCard && selectedHospital ? (originalCost * (selectedHospital.discountPercent / 100)) : 0;
    const discountedCost = originalCost - discount;
    const revenue = discountedCost * 0.15;

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/dashboard/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    hospitalId,
                    originalCost,
                    isEmergency,
                    hasCard,
                    notes
                }),
            });

            if (response.ok) {
                startTransition(() => {
                    router.refresh();
                    onClose();
                });
            }
        } catch (error) {
            console.error('Failed to update case', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-slate-900">Manage Case</h3>
                        <p className="text-xs text-slate-500">{lead.fullName} • {lead.surgery?.name || 'General Inquiry'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="QUALIFIED">QUALIFIED</option>
                                <option value="ASSIGNED">ASSIGNED</option>
                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assign Hospital</label>
                            <select
                                value={hospitalId}
                                onChange={(e) => setHospitalId(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="">Select Hospital</option>
                                <option value="">-- Clear Selection --</option>
                                {hospitals.map(h => (
                                    <option key={h.id} value={h.id}>{h.name} ({h.discountPercent}% disc)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Surgery Cost (₹)</label>
                            <input
                                type="number"
                                value={originalCost}
                                onChange={(e) => setOriginalCost(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        <div className="flex flex-col justify-end gap-2 pb-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={hasCard}
                                    onChange={(e) => setHasCard(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Has Health Card</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={isEmergency}
                                    onChange={(e) => setIsEmergency(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Emergency Case</span>
                            </label>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add patient interaction notes, callback details, etc."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Discounted Cost</span>
                            <span className="font-semibold text-slate-900">₹{discountedCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                            <span className="text-slate-500 italic">Estimated Revenue (15%)</span>
                            <span className="font-bold text-teal-600">₹{revenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
