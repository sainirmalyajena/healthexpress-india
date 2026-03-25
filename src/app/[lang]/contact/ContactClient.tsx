'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Phone, 
    Mail, 
    MessageCircle, 
    MapPin, 
    ArrowRight, 
    CheckCircle2, 
    ShieldCheck, 
    Building2, 
    Clock,
    Send,
    HelpCircle
} from 'lucide-react';
import { trackFormSubmission, trackWhatsAppClick, trackPhoneClick } from '@/components/Analytics';

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
                trackFormSubmission('contact_form', formData.get('surgery') as string | undefined);
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

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white pt-24 pb-32 md:pb-40 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            {dict.header_title}
                        </h1>
                        <p className="text-lg md:text-xl text-teal-100/90 leading-relaxed">
                            {dict.header_subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 pb-24 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Direct Contact & Trust */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-4"
                        >
                            {/* Contact Cards */}
                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all group">
                                <a href="tel:9307861041" onClick={() => trackPhoneClick('9307861041')} className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors uppercase tracking-wider text-xs">{dict.phone}</h3>
                                        <p className="text-xl font-bold text-slate-900">93078-61041</p>
                                        <p className="text-xs text-slate-500 font-medium">{dict.phone_hours}</p>
                                    </div>
                                    <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-all group-hover:translate-x-1" />
                                </a>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all group">
                                <a 
                                    href="https://wa.me/919307861041" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => trackWhatsAppClick()}
                                    className="flex items-center gap-5"
                                >
                                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition-colors uppercase tracking-wider text-xs">WhatsApp</h3>
                                        <p className="text-xl font-bold text-slate-900">93078-61041</p>
                                        <p className="text-xs text-slate-500 font-medium">{dict.whatsapp_quick}</p>
                                    </div>
                                    <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-green-500 transition-all group-hover:translate-x-1" />
                                </a>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all group">
                                <a href="mailto:hello@healthexpress.in" className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-wider text-xs">{dict.email}</h3>
                                        <p className="text-xl font-bold text-slate-900 break-all">hello@healthexpress.in</p>
                                        <p className="text-xs text-slate-500 font-medium">{dict.email_resp}</p>
                                    </div>
                                    <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                                </a>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all group">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">{dict.office}</h3>
                                        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                            C-120, 2nd Floor, Lajpat Nagar 1,<br />
                                            New Delhi - 110024
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-16 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                            <h3 className="text-xl font-bold mb-6 relative z-10">{lang === 'hi' ? 'हमारा वादा' : 'Our Commitment'}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                                    <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">100% Privacy</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-teal-400" />
                                    <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">500+ Hospitals</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-teal-400" />
                                    <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">24/7 Support</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-teal-400" />
                                    <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">Expert Guidance</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{dict.success_title}</h3>
                                        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                                            {dict.success_desc}
                                        </p>
                                        
                                        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 mb-8 text-left max-w-lg mx-auto">
                                            <h4 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-teal-500 rounded-full" />
                                                {dict.what_happens_next}
                                            </h4>
                                            <ul className="space-y-4">
                                                {[dict.step1, dict.step2, dict.step3].map((step, i) => (
                                                    <li key={i} className="flex items-start gap-4">
                                                        <div className="w-6 h-6 bg-teal-200/50 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </div>
                                                        <span className="text-teal-900 font-medium">{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold group"
                                        >
                                            <Send className="w-4 h-4" />
                                            {dict.submit_another}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-bold text-slate-900 mb-3">{dict.form_title}</h2>
                                            <p className="text-slate-500 font-medium tracking-wide border-l-4 border-teal-500 pl-4">
                                                {dict.form_subtitle}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.name} *</label>
                                                    <input 
                                                        type="text" 
                                                        id="name" 
                                                        name="name" 
                                                        required 
                                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                                                        placeholder={dict.name_placeholder} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="phone" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.phone_number} *</label>
                                                    <input 
                                                        type="tel" 
                                                        id="phone" 
                                                        name="phone" 
                                                        required 
                                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                                                        placeholder="+91 91234 56789" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label htmlFor="city" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.city}</label>
                                                    <input 
                                                        type="text" 
                                                        id="city" 
                                                        name="city" 
                                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                                                        placeholder={dict.city_placeholder} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="time" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.callback_time}</label>
                                                    <div className="relative">
                                                        <select 
                                                            id="time" 
                                                            name="time" 
                                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 appearance-none font-medium cursor-pointer"
                                                        >
                                                            <option value="">{dict.time_any}</option>
                                                            <option value="morning">{dict.time_morning}</option>
                                                            <option value="afternoon">{dict.time_afternoon}</option>
                                                            <option value="evening">{dict.time_evening}</option>
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <Clock className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="surgery" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.surgery_known}</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        id="surgery" 
                                                        name="surgery" 
                                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium" 
                                                        placeholder={dict.surgery_placeholder} 
                                                    />
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <HelpCircle className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">{dict.has_insurance}</label>
                                                <div className="flex gap-6">
                                                    {['yes', 'no'].map((val) => (
                                                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center justify-center">
                                                                <input 
                                                                    type="radio" 
                                                                    name="insurance" 
                                                                    value={val} 
                                                                    className="sr-only peer" 
                                                                />
                                                                <div className="w-6 h-6 border-2 border-slate-300 rounded-full peer-checked:border-teal-500 transition-all" />
                                                                <div className="w-3 h-3 bg-teal-500 rounded-full absolute opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" />
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide group-hover:text-teal-600 transition-colors">
                                                                {val === 'yes' ? dict.yes : dict.no}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold py-5 px-8 rounded-2xl hover:from-teal-700 hover:to-teal-800 shadow-xl shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 active:scale-95 flex items-center justify-center gap-3 text-lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        {dict.submit_loading}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        {dict.submit_btn}
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-xs text-slate-400 text-center font-medium leading-relaxed max-w-sm mx-auto">
                                                {dict.consent_prefix} <Link href={`/${lang}/terms`} className="text-teal-600 hover:text-teal-700 underline underline-offset-4 decoration-teal-600/30 font-bold">{dict.terms}</Link> & <Link href={`/${lang}/privacy`} className="text-teal-600 hover:text-teal-700 underline underline-offset-4 decoration-teal-600/30 font-bold">{dict.privacy_policy}</Link>
                                            </p>
                                        </form>

                                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-1">{dict.general_inquiry}</h3>
                                                <a href="mailto:hello@healthexpress.in" className="text-sm text-teal-600 hover:text-teal-700 font-bold font-mono">
                                                    hello@healthexpress.in
                                                </a>
                                            </div>
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Support Team" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    +5
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Section: Quick Links */}
            <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent opacity-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">{dict.quick_links}</h2>
                        <div className="w-20 h-1.5 bg-teal-500 rounded-full md:mx-0 mx-auto" />
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <Link href={`/${lang}/surgeries`} className="group">
                            <h4 className="font-bold text-teal-400 mb-3 group-hover:text-teal-300 transition-colors flex items-center gap-2 tracking-wide">
                                {dict.browse_surgeries}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </h4>
                            <p className="text-sm text-slate-400 font-medium">{lang === 'hi' ? 'सभी सेवाओं की जाँच करें' : 'Check all our services'}</p>
                        </Link>
                        
                        <Link href={`/${lang}/surgeries?category=GENERAL_SURGERY`} className="group">
                            <h4 className="font-bold text-white mb-3 group-hover:text-teal-400 transition-colors flex items-center gap-2">
                                {lang === 'hi' ? 'गैस्ट्रो / जनरल सर्जरी' : 'General Surgery'}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                            </h4>
                            <p className="text-sm text-slate-400">{lang === 'hi' ? 'हर्निया, पथरी और अन्य' : 'Hernia, Appendix & More'}</p>
                        </Link>

                        <Link href={`/${lang}/surgeries?category=ORTHOPEDICS`} className="group">
                            <h4 className="font-bold text-white mb-3 group-hover:text-teal-400 transition-colors flex items-center gap-2">
                                {lang === 'hi' ? 'ऑर्थोपेडिक्स' : 'Orthopedics'}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                            </h4>
                            <p className="text-sm text-slate-400">{lang === 'hi' ? 'जोड़ प्रत्यारोपण' : 'Joint Replacement & Support'}</p>
                        </Link>

                        <Link href={`/${lang}/faq`} className="group">
                            <h4 className="font-bold text-white mb-3 group-hover:text-teal-400 transition-colors flex items-center gap-2">
                                {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                            </h4>
                            <p className="text-sm text-slate-400">{lang === 'hi' ? 'तुरंत उत्तर प्राप्त करें' : 'Get quick answers'}</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
