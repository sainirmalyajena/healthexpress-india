'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, ShieldCheck, CarFront } from 'lucide-react';

export default function CataractCampaignForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        insuranceProvider: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                    content_name: 'Cataract_Campaign_Form',
                    city: formData.city
                });
            }

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.name,
                    phone: formData.phone,
                    city: formData.city,
                    surgeryId: 'Cataract Surgery',
                    insurance: hasInsurance ? 'YES' : 'NO',
                    description: `Facebook Cataract Campaign Lead. ${hasInsurance ? 'Has Insurance: ' + formData.insuranceProvider : ''}`,
                    utmSource: 'facebook',
                    utmCampaign: 'cataract_campaign',
                    consent: true
                })
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                if (errorData.details && errorData.details.fieldErrors) {
                    const firstError = Object.values(errorData.details.fieldErrors)[0] as string[];
                    if (firstError && firstError.length > 0) throw new Error(firstError[0]);
                }
                throw new Error(errorData.error || 'Submission failed');
            }
        } catch (error: unknown) {
            const err = error as Error;
            alert(err.message || "Something went wrong. Please try calling us directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 text-center animate-reveal">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-600 mb-6">Our medical counselor will call you shortly to guide you regarding Lens choices and Insurance limits.</p>
                <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-700 mb-4">
                    <p>Free Cab Service will be coordinated during the call.</p>
                </div>
                <a
                    href={`https://wa.me/919307861041?text=${encodeURIComponent(`Hello HealthExpress, I just requested a Cataract consultation in ${formData.city || 'Mumbai'}. Can I get details on Lens pricing and cashless insurance?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all hover:scale-[1.02]"
                >
                    💬 Connect with Eye Counselor on WhatsApp
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 mt-2">Book Free Eye Checkup</h3>
            <p className="text-slate-500 mb-6 text-sm">Fill details to check cashless insurance coverage for Cataract.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        required 
                        placeholder="Patient Full Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="tel" 
                        required 
                        pattern="[0-9]{10}"
                        placeholder="Phone Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input 
                        type="text" 
                        required 
                        placeholder="City" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={hasInsurance}
                            onChange={(e) => setHasInsurance(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-slate-700">Check if Insurance covers Cataract</span>
                    </label>
                </div>

                {hasInsurance && (
                    <div className="animate-reveal">
                        <input 
                            type="text" 
                            placeholder="Insurance Provider (e.g. Star Health, HDFC Ergo)" 
                            value={formData.insuranceProvider}
                            onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isSubmitting ? 'Processing...' : 'Get Free Consultation'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    100% Cashless Available
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <CarFront className="w-5 h-5 text-amber-500" />
                    Free Cab on Surgery Day
                </div>
            </div>
        </div>
    );
}
