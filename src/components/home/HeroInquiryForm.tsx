'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Activity, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

export default function HeroInquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        surgeryName: '',
        insuranceProvider: '',
    });

    const [hasInsurance, setHasInsurance] = useState(false);

    const SURGERIES = [
        "Eye Surgery (LASIK/Cataract)",
        "Orthopedic (Knee/Hip)",
        "Proctology (Piles/Fissure)",
        "Laparoscopy (Hernia/Gallbladder)",
        "Cosmetic (Hair/Gynecomastia)",
        "IVF & Fertility",
        "Urology (Kidney Stones)",
        "Other Surgery"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                    content_name: 'Hero Form Lead',
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
                    surgeryId: formData.surgeryName || 'Not Specified',
                    insurance: hasInsurance ? 'YES' : 'NO',
                    description: `Homepage Hero Lead. ${hasInsurance ? 'Has Insurance: ' + formData.insuranceProvider : ''}`,
                    utmSource: 'homepage_hero',
                    utmCampaign: 'organic',
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
            <div className="bg-white p-8 rounded-[2rem] border border-teal-100 text-center animate-reveal shadow-2xl shadow-black/20 h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-100">
                    <CheckCircle className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Request Received!</h3>
                <p className="text-slate-600 mb-8 text-lg font-medium">Our medical expert will call you within <span className="text-slate-900 font-bold">15 minutes</span> to discuss your case.</p>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-medium text-slate-700 w-full">
                    <p>We will verify your insurance and provide a transparent cost estimate during the call.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-teal-900/30 overflow-hidden group">
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-teal-600" />
            
            <div className="relative z-10 pt-2">
                <div className="mb-8 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">Get a Free Estimate</h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium">Top surgeons. NABH hospitals. Zero hidden costs.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Group: Name */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <input 
                            type="text" 
                            required 
                            placeholder="Patient's Full Name" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                        />
                    </div>

                    {/* Input Group: Phone & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-teal-600" />
                            </div>
                            <input 
                                type="tel" 
                                required 
                                pattern="[0-9]{10}"
                                placeholder="Phone Number" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-teal-600" />
                            </div>
                            <input 
                                type="text" 
                                required 
                                placeholder="Your City" 
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Input Group: Surgery Dropdown */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Activity className="h-5 w-5 text-teal-600" />
                        </div>
                        <select 
                            required
                            value={formData.surgeryName}
                            onChange={(e) => setFormData({...formData, surgeryName: e.target.value})}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none transition-all font-medium appearance-none shadow-sm ${formData.surgeryName ? 'text-slate-900' : 'text-slate-400'}`}
                        >
                            <option value="" disabled className="text-slate-500">Select Surgery Type</option>
                            {SURGERIES.map(s => (
                                <option key={s} value={s} className="text-slate-900 py-2">{s}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <div className="w-2 h-2 border-b-2 border-r-2 border-slate-400 transform rotate-45 mb-1" />
                        </div>
                    </div>

                    {/* Insurance Toggle */}
                    <div className="pt-1">
                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white transition-colors group/label shadow-sm">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={hasInsurance}
                                    onChange={(e) => setHasInsurance(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-teal-600 peer-checked:border-teal-600 transition-all flex items-center justify-center bg-white">
                                    <CheckCircle className={`w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity`} />
                                </div>
                            </div>
                            <span className="font-bold text-slate-700 group-hover/label:text-slate-900 transition-colors text-sm md:text-base">I have Health Insurance</span>
                        </label>
                    </div>

                    {/* Conditional Insurance Provider */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hasInsurance ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <input 
                            type="text" 
                            placeholder="Insurance Provider (e.g. Star Health, HDFC)" 
                            value={formData.insuranceProvider}
                            onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                            className="w-full px-4 py-4 bg-teal-50 border border-teal-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-teal-700/50 font-medium shadow-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 md:py-5 mt-4 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:shadow-none"
                    >
                        {isSubmitting ? 'Securely Submitting...' : 'Find My Surgeon'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        HIPAA Compliant
                    </div>
                </div>
            </div>
        </div>
    );
}
