'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, ArrowRight, Send } from 'lucide-react';

import Link from 'next/link';

interface ContactClientProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

export default function ContactClient({ lang, dict }: ContactClientProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            fullName: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string || '',
            city: formData.get('city') as string || 'Not specified',
            surgeryId: formData.get('surgery') as string || 'General Consultation',
            description: `General inquiry from contact form. Surgery: ${formData.get('surgery') || 'Not specified'}`,
            insurance: (formData.get('insurance') === 'yes' ? 'YES' : 'NO') as 'YES' | 'NO',
            callbackTime: formData.get('time') as string || undefined,
            sourcePage: 'contact',
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

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Column: Direct Contact & Info */}
                    <div className="space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-teal-100">
                                {lang === 'hi' ? 'हमसे संपर्क करें' : 'Contact Support'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                                {dict.header_title}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium">
                                {dict.header_subtitle}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <a href="tel:9307861041" className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-teal-50 transition-colors border border-slate-100 hover:border-teal-100 group">
                                <div className="w-10 h-10 bg-white text-teal-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{dict.phone}</h3>
                                    <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">93078-61041</p>
                                </div>
                            </a>

                            <a href="https://wa.me/919307861041" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-green-50 transition-colors border border-slate-100 hover:border-green-100 group">
                                <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp</h3>
                                    <p className="font-bold text-slate-900 group-hover:text-green-700 transition-colors">Quick Reply</p>
                                </div>
                            </a>

                            <a href="mailto:sai@healthexpressindia.com" className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 hover:border-blue-100 group sm:col-span-2">
                                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{dict.email}</h3>
                                    <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">sai@healthexpressindia.com</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-100 relative">
                        {submitted ? (
                            <div className="py-10 text-center animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{dict.success_title}</h3>
                                <p className="text-slate-500 mb-8">{dict.success_subtitle}</p>
                                
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold group"
                                >
                                    <Send className="w-4 h-4" />
                                    {dict.submit_another}
                                </button>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{dict.form_title}</h2>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {dict.form_subtitle}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">{dict.name} *</label>
                                            <input type="text" id="name" name="name" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder={dict.name_placeholder} />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">{dict.phone_number} *</label>
                                            <input type="tel" id="phone" name="phone" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder="+91 91234 56789" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="city" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">{dict.city}</label>
                                            <input type="text" id="city" name="city" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder={dict.city_placeholder} />
                                        </div>
                                        <div>
                                            <label htmlFor="time" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">{dict.callback_time}</label>
                                            <div className="relative">
                                                <select id="time" name="time" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer">
                                                    <option value="">{dict.time_any}</option>
                                                    <option value="morning">{dict.time_morning}</option>
                                                    <option value="afternoon">{dict.time_afternoon}</option>
                                                    <option value="evening">{dict.time_evening}</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="surgery" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">{dict.surgery_known}</label>
                                        <input type="text" id="surgery" name="surgery" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder={dict.surgery_placeholder} />
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-0.5">
                                                <input type="checkbox" required className="w-4 h-4 border-2 border-slate-300 rounded text-teal-600 focus:ring-teal-500 cursor-pointer" />
                                            </div>
                                            <span className="text-xs text-slate-500 leading-relaxed font-medium">
                                                {lang === 'hi' 
                                                    ? <>मैं HealthExpress India को <Link href={`/${lang}/privacy`} className="text-teal-600 hover:underline font-bold" target="_blank">गोपनीयता नीति</Link> के अनुसार अपने चिकित्सा उपचार के समन्वय के लिए मेरा व्यक्तिगत डेटा एकत्र करने की सहमति देता/देती हूँ।</>
                                                    : <>I consent to HealthExpress India collecting my personal data to coordinate my medical treatment as per the <Link href={`/${lang}/privacy`} className="text-teal-600 hover:underline font-bold" target="_blank">Privacy Policy</Link>.</>
                                                }
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {dict.submit_loading}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {dict.submit_btn}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
