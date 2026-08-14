'use client';

import { useState } from 'react';
import { IndianRupee, ShieldCheck, PieChart, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PricingIndexWidgetProps {
    surgeryName: string;
    marketCost: number;
    partnerCost: number;
    lang: string;
}

export function PricingIndexWidget({ surgeryName, marketCost, partnerCost, lang }: PricingIndexWidgetProps) {
    const [emiMonths, setEmiMonths] = useState<number>(12);
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const monthlyEmi = Math.round(partnerCost / emiMonths);
    const savings = marketCost - partnerCost;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: 'Pricing Index User',
                    phone: formData.get('phone') as string,
                    city: 'Online',
                    description: `Pricing locked for ${surgeryName}. EMI preference: ${emiMonths} months (₹${monthlyEmi}/mo).`,
                    sourcePage: 'pricing_index',
                    consent: true
                }),
            });

            if (response.ok) {
                setLeadSubmitted(true);
            }
        } catch (err) {
            console.error('Failed to submit pricing lead', err);
        } finally {
            setLoading(false);
        }
    };

    if (leadSubmitted) {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-in zoom-in h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-16 h-16 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {lang === 'hi' ? 'दर सुरक्षित कर ली गई है!' : 'Rate Locked In!'}
                </h3>
                <p className="text-slate-600 mb-6">
                    {lang === 'hi' 
                        ? 'हमारे वित्तीय सलाहकार आपको जल्द ही कॉल करेंगे ताकि आपकी 0% EMI योजना को अंतिम रूप दिया जा सके।' 
                        : 'Our financial advisor will call you shortly to finalize your 0% EMI plan.'}
                </p>
                <div className="bg-slate-50 p-4 rounded-xl w-full border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{lang === 'hi' ? 'अनुमानित EMI' : 'Estimated EMI'}</p>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(monthlyEmi)}<span className="text-sm text-slate-500 font-medium">/mo</span></p>
                </div>
            </div>
        );
    }

    return (
        <section 
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden font-sans flex flex-col h-full"
            aria-label={`Pricing and EMI calculator for ${surgeryName}`}
        >
            {/* Header */}
            <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-16 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold mb-1">
                            {lang === 'hi' ? 'लागत और EMI कैलकुलेटर' : 'Cost & EMI Calculator'}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">
                            {lang === 'hi' ? 'पारदर्शी मूल्य निर्धारण सूचकांक' : 'Transparent Pricing Index'}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Calculator className="w-6 h-6 text-teal-400" />
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Benchmark Section */}
                <div className="flex gap-4 items-stretch mb-8">
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-teal-200 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {lang === 'hi' ? 'शहर का औसत' : 'City Average'}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-slate-700 line-through opacity-70">
                            {formatCurrency(marketCost)}
                        </p>
                    </div>
                    <div className="flex-[1.5] bg-teal-50 p-4 rounded-2xl border border-teal-100 relative overflow-hidden group hover:border-teal-300 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {lang === 'hi' ? 'हमारा दर' : 'HealthExpress Rate'}
                        </p>
                        <p className="text-xl md:text-2xl font-black text-teal-700">
                            {formatCurrency(partnerCost)}
                        </p>
                        <p className="text-xs font-bold text-green-600 mt-1">
                            {lang === 'hi' ? 'बचत' : 'Save'} {formatCurrency(savings)}
                        </p>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart className="w-4 h-4 text-slate-400" />
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            {lang === 'hi' ? 'लागत विभाजन' : 'Cost Breakdown'}
                        </h4>
                    </div>
                    
                    <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden mb-4">
                        <div className="h-full bg-slate-800" style={{ width: '30%' }} title="Surgeon Fee" />
                        <div className="h-full bg-slate-500" style={{ width: '30%' }} title="Hospital Room" />
                        <div className="h-full bg-slate-400" style={{ width: '25%' }} title="OT Charges" />
                        <div className="h-full bg-slate-300" style={{ width: '15%' }} title="Consumables" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <span className="text-xs text-slate-600 font-medium">{lang === 'hi' ? 'सर्जन शुल्क (30%)' : 'Surgeon Fee (30%)'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                            <span className="text-xs text-slate-600 font-medium">{lang === 'hi' ? 'अस्पताल का कमरा (30%)' : 'Hospital Room (30%)'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                            <span className="text-xs text-slate-600 font-medium">{lang === 'hi' ? 'OT शुल्क (25%)' : 'OT Charges (25%)'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="text-xs text-slate-600 font-medium">{lang === 'hi' ? 'दवाइयाँ (15%)' : 'Consumables (15%)'}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 my-6" />

                {/* EMI Slider */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            {lang === 'hi' ? '0% EMI विकल्प' : '0% EMI Options'}
                        </h4>
                        <div className="text-right">
                            <span className="text-2xl font-black text-slate-900">{formatCurrency(monthlyEmi)}</span>
                            <span className="text-xs text-slate-500 font-medium ml-1">/mo</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {[3, 6, 9, 12].map((months) => (
                            <button
                                key={months}
                                type="button"
                                onClick={() => setEmiMonths(months)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                    emiMonths === months 
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                                }`}
                            >
                                {months}m
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-green-600 font-bold mt-3 flex items-center gap-1 justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lang === 'hi' ? 'कोई छिपा हुआ शुल्क नहीं' : 'No hidden interest charges'}
                    </p>
                </div>
                
                <div className="mt-auto">
                    {/* Lead Capture */}
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                        <div className="relative">
                            <input 
                                type="tel" 
                                name="phone"
                                placeholder={lang === 'hi' ? "अपना मोबाइल नंबर दर्ज करें" : "Enter your mobile number"}
                                required
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <IndianRupee className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        
                        <div className="pt-1">
                            <label className="flex items-start gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                    <input 
                                        type="checkbox" 
                                        name="consent" 
                                        required
                                        className="w-4 h-4 border-2 border-slate-300 rounded peer accent-teal-600 transition-all cursor-pointer" 
                                    />
                                </div>
                                <span className="text-[10px] sm:text-xs font-medium text-slate-500 leading-relaxed">
                                    {lang === 'hi' 
                                        ? <>मैं <Link href={`/${lang}/privacy`} className="text-teal-600 hover:underline font-bold" target="_blank">गोपनीयता नीति</Link> के अनुसार सहमत हूँ।</>
                                        : <>I consent to data collection as per the <Link href={`/${lang}/privacy`} className="text-teal-600 hover:underline font-bold" target="_blank">Privacy Policy</Link>.</>
                                    }
                                </span>
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {lang === 'hi' ? 'यह दर सुरक्षित करें' : 'Lock in this Rate'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
