'use client';

import { useState } from 'react';

interface LogCallModalProps {
    leadId: string;
    leadName: string;
    onClose: () => void;
    onLogged: () => void;
}

const CALL_OUTCOMES = [
    { value: 'Connected', emoji: '?' },
    { value: 'No Answer', emoji: '??' },
    { value: 'Left Voicemail', emoji: '??' },
    { value: 'Wrong Number', emoji: '?' },
    { value: 'Call Back Later', emoji: '??' },
];

export default function LogCallModal({ leadId, leadName, onClose, onLogged }: LogCallModalProps) {
    const [outcome, setOutcome] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!outcome) return;
        setLoading(true);

        try {
            await fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    actionType: 'CALL_LOGGED',
                    details: JSON.stringify({ outcome, note })
                })
            });
            onLogged();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Log Call</h3>
                <p className="text-sm text-slate-500 mb-4">Recording call for <span className="font-semibold text-slate-700">{leadName}</span></p>

                <label className="block text-sm font-medium text-slate-700 mb-2">Call Outcome *</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {CALL_OUTCOMES.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => setOutcome(o.value)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                outcome === o.value
                                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-200'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                        >
                            <span>{o.emoji}</span> {o.value}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="What did you discuss?"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none mb-4"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!outcome || loading}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Saving...' : 'Log Call'}
                    </button>
                </div>
            </div>
        </div>
    );
}

