'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddHospitalModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '', email: '', doctorName: '', address: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch('/api/dashboard/hospitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsOpen(false);
            setFormData({ name: '', city: '', email: '', doctorName: '', address: '' });
            router.refresh();
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 shadow-sm transition-all">
                + Add Hospital
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add Partner Hospital</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-bold mb-1">Hospital Name</label><input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg" /></div>
                            <div><label className="block text-sm font-bold mb-1">City / Location</label><input required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full border p-2 rounded-lg" /></div>
                            <div><label className="block text-sm font-bold mb-1">Contact Email</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-lg" /></div>
                                                        <div><label className="block text-sm font-bold mb-1">Doctor Name (Optional)</label><input value={formData.doctorName} onChange={e=>setFormData({...formData, doctorName: e.target.value})} className="w-full border p-2 rounded-lg" /></div>
                            <div><label className="block text-sm font-bold mb-1">Exact Address (For Pitching)</label><textarea placeholder="Third Floor, Gandhar Nagar..." value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full border p-2 rounded-lg" rows={3}></textarea></div>
                            <button disabled={saving} className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold">{saving ? 'Saving...' : 'Add Hospital'}</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

