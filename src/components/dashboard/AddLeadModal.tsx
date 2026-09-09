'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddLeadModal({ surgeries }: { surgeries: { id: string, name: string }[] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: '',
        surgeryId: surgeries.length > 0 ? surgeries[0].id : '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/dashboard/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setIsOpen(false);
                setFormData({ fullName: '', phone: '', city: '', surgeryId: surgeries.length > 0 ? surgeries[0].id : '', description: '' });
                router.refresh();
            } else {
                setError(data.error || 'Failed to add lead');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 flex items-center gap-2 shadow-sm text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Add Lead
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-black text-slate-900">Manually Add Lead</h2>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">?</button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4 font-medium">{error}</div>}
                    
                    <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                                placeholder="Patient Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                                placeholder="e.g. +919876543210"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">City / Place *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                                placeholder="e.g. Mumbai"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Interested Surgery</label>
                            <select 
                                value={formData.surgeryId}
                                onChange={e => setFormData({...formData, surgeryId: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                            >
                                {surgeries.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Initial Notes</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                                placeholder="Any details from the phone call..."
                                rows={2}
                            />
                        </div>
                    </form>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
                    <button 
                        type="submit" 
                        form="add-lead-form"
                        disabled={saving}
                        className="px-6 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Lead'}
                    </button>
                </div>
            </div>
        </div>
    );
}
