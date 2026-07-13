'use client';

import { useState } from 'react';
import { CheckCircle, CarFront, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LasikCampaignForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        insuranceProvider: '',
        city: '',
    });

    const [hasInsurance, setHasInsurance] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Track lead event via Pixel
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                    content_name: 'LASIK Campaign',
                    city: formData.city
                });
            }

            // Submit to API endpoint (which handles DB and email)
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    city: formData.city,
                    surgeryId: 'LASIK Eye Surgery',
                    insurance: hasInsurance ? 'YES' : 'NO',
                    description: `Facebook LASIK Campaign Lead. ${hasInsurance ? 'Has Insurance: ' + formData.insuranceProvider : ''}`,
                    utmSource: 'facebook',
                    utmCampaign: 'lasik_campaign',
                    consent: true
                })
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try calling us directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-teal-100 text-center animate-reveal">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-600 mb-6">Our eye-care counselor will call you within 15 minutes to confirm your free consultation.</p>
                <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-700">
                    <p>Free Cab Service will be coordinated during the call.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 mt-2">Claim Your Free Consultation</h3>
            <p className="text-slate-500 mb-6 text-sm">Fill details to check insurance coverage and book your slot.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        required 
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="tel" 
                        required 
                        pattern="[0-9]{10}"
                        placeholder="Phone Number (10 digits)" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                    <input 
                        type="text" 
                        required 
                        placeholder="City" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={hasInsurance}
                            onChange={(e) => setHasInsurance(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-medium text-slate-700">Check if my Insurance covers LASIK</span>
                    </label>
                </div>

                {hasInsurance && (
                    <div className="animate-reveal">
                        <input 
                            type="text" 
                            placeholder="Insurance Provider (e.g. Star Health, HDFC Ergo)" 
                            value={formData.insuranceProvider}
                            onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                            className="w-full px-4 py-3 bg-teal-50 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isSubmitting ? 'Processing...' : 'Get Free Consultation'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Cashless Available
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <CarFront className="w-5 h-5 text-amber-500" />
                    Free Cab on Surgery Day
                </div>
            </div>
        </div>
    );
}
