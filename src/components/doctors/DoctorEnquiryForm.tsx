'use client';

import { useState } from 'react';
import { Send, Phone, User, Stethoscope } from 'lucide-react';
import { trackFormSubmission } from '@/components/Analytics';

interface DoctorEnquiryFormProps {
    lang: string;
}

export function DoctorEnquiryForm({ lang }: DoctorEnquiryFormProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            fullName: formData.get('name') as string,
            phone: formData.get('phone') as string,
            surgeryId: formData.get('specialty') as string || 'General Consultation',
            description: `Doctor Directory Enquiry: Seeking ${formData.get('specialty') || 'consultation'}.`,
            city: 'Not specified',
            sourcePage: 'doctors_directory',
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
                trackFormSubmission('doctor_directory_enquiry', data.surgeryId);
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
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Request Received!</h3>
                <p className="text-teal-50 font-medium">
                    Our medical expert will call you shortly to assist with your consultation.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-28">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white text-center">
                <h3 className="text-xl font-black tracking-tight mb-2">Free Expert Guidance</h3>
                <p className="text-teal-100 text-sm font-medium">Not sure which doctor is right for you? Let us help.</p>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Enter your full name"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                            <span className="absolute left-10 top-3.5 text-slate-500 font-medium">+91</span>
                            <input
                                type="tel"
                                name="phone"
                                required
                                pattern="[0-9]{10}"
                                placeholder="Enter 10-digit number"
                                className="w-full pl-[72px] pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Specialty Needed</label>
                        <div className="relative">
                            <Stethoscope className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                            <select
                                name="specialty"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 appearance-none"
                            >
                                <option value="">Select condition (Optional)</option>
                                <option value="Cataract">Cataract</option>
                                <option value="LASIK">LASIK / Refractive</option>
                                <option value="Orthopedics">Orthopedics / Knee</option>
                                <option value="Gynecology">Gynecology</option>
                                <option value="Urology">Urology</option>
                                <option value="General Surgery">General Surgery</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-slate-900 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Submitting...' : 'Request Callback'}
                        {!loading && <Send className="w-4 h-4" />}
                    </button>
                    
                    <p className="text-[10px] text-slate-400 text-center mt-4">
                        By submitting, you agree to our privacy policy. Your data is secure.
                    </p>
                </form>
            </div>
        </div>
    );
}
