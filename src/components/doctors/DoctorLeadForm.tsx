'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { trackFormSubmission } from '@/components/Analytics';

interface DoctorLeadFormProps {
    doctorId: string;
    doctorName: string;
    lang: string;
}

export function DoctorLeadForm({ doctorName }: DoctorLeadFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            fullName: formData.get('name') as string,
            phone: formData.get('phone') as string,
            description: `Consultation request specifically for ${doctorName}`,
            sourcePage: 'doctor_profile',
            consent: true,
        };

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
                trackFormSubmission('doctor_profile_form');
            } else {
                alert(result.error || 'Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100 text-center animate-in zoom-in h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-16 h-16 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                <p className="text-slate-600 mb-6">Our team will contact you shortly to confirm your consultation with {doctorName}.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-teal-700 font-bold hover:underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 h-full">
            <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Book Consultation</h3>
                <p className="text-slate-500 font-medium text-sm">Schedule your appointment with {doctorName} today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name *</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm" 
                        placeholder="Your Name" 
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Phone Number *</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm" 
                        placeholder="Your Mobile Number" 
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold py-4 px-6 rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-xl shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Request Appointment
                        </>
                    )}
                </button>
                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed mt-4">
                    By submitting, you agree to our Terms and Privacy Policy. A representative will contact you to confirm the time.
                </p>
            </form>
        </div>
    );
}
