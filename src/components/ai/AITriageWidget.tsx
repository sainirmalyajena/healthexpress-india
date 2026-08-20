'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Activity, Heart, Leaf, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TriageResult {
    diagnosisSummary: string;
    medicalTermsExplained: string[];
    recommendedSurgery: string;
    urgency: "High" | "Medium" | "Low";
    surgicalNecessity: "NOT_RECOMMENDED" | "CONSULTATION_NEEDED" | "HIGHLY_LIKELY";
    alternativeTreatments: string[];
    nextSteps: string;
}

export function AITriageWidget({ lang }: { lang: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TriageResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
            setError(null);
        } else {
            setError(lang === 'hi' ? 'कृपया केवल चित्र अपलोड करें।' : 'Please upload an image file only.');
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lang', lang);

        try {
            const response = await fetch('/api/ai/triage', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze report');
            }

            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const phone = formData.get('phone') as string;

        const isSurgeryNeeded = result?.surgicalNecessity === 'HIGHLY_LIKELY';
        const description = isSurgeryNeeded
            ? `AI Triage Lead. Surgery Recommended: ${result?.recommendedSurgery}. Diagnosis: ${result?.diagnosisSummary}`
            : `AI Triage Lead (Non-Surgical). Diagnosis: ${result?.diagnosisSummary}. Alternative treatments recommended: ${result?.alternativeTreatments?.join('; ')}`;

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: 'AI Triage User',
                    phone: phone,
                    city: 'Online',
                    surgeryId: 'General Consultation',
                    insurance: 'NOT_SURE',
                    description: description,
                    sourcePage: isSurgeryNeeded ? 'ai_triage_surgical' : 'ai_triage_nonsurgical',
                    consent: true
                }),
            });

            if (response.ok) {
                setLeadSubmitted(true);
            } else {
                alert(lang === 'hi' ? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' : 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Failed to submit lead', err);
            alert(lang === 'hi' ? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Lead Submitted Success ─────────────────────────────────────────
    if (leadSubmitted) {
        const isSurgeryNeeded = result?.surgicalNecessity === 'HIGHLY_LIKELY';
        return (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center animate-in zoom-in duration-300">
                <div className={`w-20 h-20 ${isSurgeryNeeded ? 'bg-green-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {isSurgeryNeeded 
                        ? <CheckCircle2 className="w-10 h-10 text-green-600" />
                        : <Heart className="w-10 h-10 text-emerald-600" />
                    }
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {lang === 'hi' ? 'अनुरोध प्राप्त हुआ!' : 'Request Received!'}
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {isSurgeryNeeded
                        ? (lang === 'hi' 
                            ? 'हमारे मेडिकल विशेषज्ञ आपकी रिपोर्ट की समीक्षा कर रहे हैं और जल्द ही आपको कॉल करेंगे।' 
                            : 'Our medical experts are reviewing your report and will call you shortly to discuss next steps.')
                        : (lang === 'hi'
                            ? 'हमारे विशेषज्ञ आपके लिए एक व्यक्तिगत गैर-सर्जिकल रिकवरी योजना तैयार करेंगे।'
                            : 'Our experts will prepare a personalized non-surgical recovery plan tailored to your condition.')
                    }
                </p>
                <button
                    onClick={() => {
                        setLeadSubmitted(false);
                        setResult(null);
                        setFile(null);
                        setPreview(null);
                    }}
                    className="text-teal-600 hover:text-teal-700 font-bold"
                >
                    {lang === 'hi' ? 'एक और रिपोर्ट का विश्लेषण करें' : 'Analyze another report'}
                </button>
            </div>
        );
    }

    // ─── Result Display ─────────────────────────────────────────────────
    if (result) {
        const isSurgeryNotNeeded = result.surgicalNecessity === 'NOT_RECOMMENDED';
        const isConsultationNeeded = result.surgicalNecessity === 'CONSULTATION_NEEDED';
        const isSurgeryLikely = result.surgicalNecessity === 'HIGHLY_LIKELY';

        return (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-3 mb-2 relative z-10 justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-teal-400" />
                            <h3 className="text-xl font-bold">{lang === 'hi' ? 'AI रिपोर्ट विश्लेषण' : 'AI Report Analysis'}</h3>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {lang === 'hi' ? 'डाउनलोड करें' : 'Download PDF'}
                        </button>
                    </div>
                    <p className="text-slate-400 text-sm relative z-10">
                        {lang === 'hi' ? 'यह एक AI-जनित सारांश है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।' : 'This is an AI-generated summary and not a substitute for professional medical advice.'}
                    </p>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">

                    {/* ═══ THE HONESTY BADGE ═══ */}
                    {isSurgeryNotNeeded && (
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-5">
                                <Heart className="w-48 h-48 -mt-8 -mr-8" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Leaf className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-emerald-900">
                                            {lang === 'hi' ? '🎉 अच्छी खबर: सर्जरी की जरूरत नहीं!' : '🎉 Great News: Surgery is Not Needed!'}
                                        </h4>
                                        <p className="text-sm font-medium text-emerald-700">
                                            {lang === 'hi' ? 'आपकी स्थिति का इलाज बिना सर्जरी के संभव है।' : 'Your condition can be managed without surgery.'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                                    {lang === 'hi'
                                        ? 'HealthExpress में हमारा मानना है कि सबसे अच्छी सर्जरी वो है जो कभी करनी ही न पड़े। आपकी रिपोर्ट के आधार पर, हम गैर-सर्जिकल उपचार की सिफारिश करते हैं।'
                                        : 'At HealthExpress, we believe the best surgery is the one you never need. Based on your report, we recommend a non-surgical treatment path.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {isConsultationNeeded && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-amber-600" />
                                </div>
                                <h4 className="text-lg font-bold text-amber-900">
                                    {lang === 'hi' ? 'विशेषज्ञ परामर्श की आवश्यकता' : 'Specialist Consultation Recommended'}
                                </h4>
                            </div>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                {lang === 'hi'
                                    ? 'आपकी रिपोर्ट में कुछ निष्कर्ष हैं जिनके लिए विशेषज्ञ मूल्यांकन की आवश्यकता है। सर्जरी आवश्यक है या नहीं, यह निर्धारित करने के लिए एक विशेषज्ञ से मिलें।'
                                    : 'Your report has findings that require specialist evaluation. A doctor will determine whether surgery is needed or if non-surgical options are sufficient.'}
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                        <h4 className="font-bold text-slate-900 mb-2">{lang === 'hi' ? 'निष्कर्ष' : 'Summary'}</h4>
                        <p className="text-slate-700 leading-relaxed text-sm">{result.diagnosisSummary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Medical Terms */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-3">{lang === 'hi' ? 'चिकित्सा शर्तें (सरल भाषा में)' : 'Medical Terms Explained'}</h4>
                            <ul className="space-y-3">
                                {result.medicalTermsExplained.map((term, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                                        <span>{term}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Plan */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">{lang === 'hi' ? 'अगले कदम' : 'Action Plan'}</h4>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{lang === 'hi' ? 'सर्जिकल आवश्यकता' : 'Surgical Necessity'}</span>
                                    <span className={`inline-block font-bold px-3 py-1 rounded-full text-sm ${
                                        isSurgeryNotNeeded ? 'bg-emerald-100 text-emerald-800' :
                                        isConsultationNeeded ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {isSurgeryNotNeeded 
                                            ? (lang === 'hi' ? '✅ सर्जरी जरूरी नहीं' : '✅ Surgery Not Required')
                                            : isConsultationNeeded 
                                            ? (lang === 'hi' ? '⚠️ परामर्श आवश्यक' : '⚠️ Consultation Needed')
                                            : (lang === 'hi' ? '🏥 सर्जरी की सम्भावना' : '🏥 Surgery Likely Needed')
                                        }
                                    </span>
                                </div>
                                {isSurgeryLikely && (
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{lang === 'hi' ? 'अनुशंसित सर्जरी' : 'Recommended Procedure'}</span>
                                        <span className="inline-block bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">
                                            {result.recommendedSurgery}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{lang === 'hi' ? 'तत्काल' : 'Urgency'}</span>
                                    <span className={`inline-block font-bold px-3 py-1 rounded-full text-sm ${
                                        result.urgency === 'High' ? 'bg-red-100 text-red-800' : 
                                        result.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {result.urgency}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 pt-2 border-t border-slate-200 mt-4">
                                    {result.nextSteps}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ═══ ALTERNATIVE TREATMENTS SECTION ═══ */}
                    {result.alternativeTreatments && result.alternativeTreatments.length > 0 && (
                        <div className={`rounded-2xl p-6 border ${isSurgeryNotNeeded ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Leaf className={`w-5 h-5 ${isSurgeryNotNeeded ? 'text-emerald-600' : 'text-teal-600'}`} />
                                {lang === 'hi' ? 'गैर-सर्जिकल उपचार विकल्प' : 'Non-Surgical Treatment Options'}
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {result.alternativeTreatments.map((treatment, i) => {
                                    const parts = treatment.split(':');
                                    const title = parts[0]?.trim();
                                    const desc = parts.slice(1).join(':').trim();
                                    return (
                                        <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black ${isSurgeryNotNeeded ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{title}</p>
                                                    {desc && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══ ADAPTIVE LEAD CAPTURE ═══ */}
                    <div className="border-t border-slate-100 pt-8 mt-8">
                        <div className={`rounded-3xl p-6 md:p-8 text-white text-center ${
                            isSurgeryNotNeeded 
                                ? 'bg-gradient-to-br from-emerald-800 to-teal-900' 
                                : 'bg-gradient-to-br from-slate-900 to-slate-800'
                        }`}>
                            <h4 className="text-xl font-bold mb-2">
                                {isSurgeryNotNeeded
                                    ? (lang === 'hi' ? 'गैर-सर्जिकल रिकवरी प्लान पाएं' : 'Get Your Non-Surgical Recovery Plan')
                                    : isConsultationNeeded
                                    ? (lang === 'hi' ? 'विशेषज्ञ से मुफ्त परामर्श' : 'Free Specialist Consultation')
                                    : (lang === 'hi' ? 'विशेषज्ञ से परामर्श लें' : 'Consult a Specialist')
                                }
                            </h4>
                            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
                                {isSurgeryNotNeeded
                                    ? (lang === 'hi'
                                        ? 'हमारे विशेषज्ञ आपके लिए एक व्यक्तिगत गैर-सर्जिकल उपचार योजना तैयार करेंगे। कोई सर्जरी नहीं, कोई दबाव नहीं।'
                                        : 'Our experts will create a personalized non-surgical treatment plan for you. No surgery pressure, just honest care.')
                                    : isConsultationNeeded
                                    ? (lang === 'hi'
                                        ? 'एक विशेषज्ञ आपकी रिपोर्ट की समीक्षा करेगा और तय करेगा कि सर्जरी जरूरी है या नहीं।'
                                        : 'A specialist will review your report and honestly determine if surgery is truly necessary or not.')
                                    : (lang === 'hi' 
                                        ? `हम आपको ${result.recommendedSurgery} के लिए सबसे अच्छे सर्जन से जोड़ सकते हैं। अभी अपना नंबर दर्ज करें।` 
                                        : `We can connect you with the best surgeon for ${result.recommendedSurgery}. Enter your number for a free consultation.`)
                                }
                            </p>
                            
                            <form onSubmit={handleLeadSubmit} className="max-w-sm mx-auto space-y-4">
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="+91 91234 56789"
                                    required
                                    aria-label="Enter your phone number"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-teal-400 focus:outline-none text-center font-medium"
                                />
                                <div className="text-left pt-2 pb-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input 
                                                type="checkbox" 
                                                name="consent" 
                                                required
                                                className="w-4 h-4 border-2 border-white/30 rounded peer accent-teal-400 transition-all cursor-pointer" 
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-300 leading-relaxed">
                                            {lang === 'hi' 
                                                ? <>मैं <Link href={`/${lang}/privacy`} className="text-teal-400 hover:underline" target="_blank">गोपनीयता नीति</Link> के अनुसार सहमत हूँ।</>
                                                : <>I consent to data collection as per the <Link href={`/${lang}/privacy`} className="text-teal-400 hover:underline" target="_blank">Privacy Policy</Link>.</>
                                            }
                                        </span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
                                    } ${
                                        isSurgeryNotNeeded
                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                                            : 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-teal-500/20'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {lang === 'hi' ? 'भेजा जा रहा है...' : 'Sending...'}
                                        </>
                                    ) : (
                                        <>
                                            {isSurgeryNotNeeded
                                                ? (lang === 'hi' ? 'मुफ्त रिकवरी प्लान पाएं' : 'Get Free Recovery Plan')
                                                : isConsultationNeeded
                                                ? (lang === 'hi' ? 'मुफ्त परामर्श बुक करें' : 'Book Free Consultation')
                                                : (lang === 'hi' ? 'मुफ़्त कॉल बुक करें' : 'Book Free Call')
                                            }
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Upload State ────────────────────────────────────────────────────
    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-xs font-black uppercase tracking-widest text-teal-400 mb-6 shadow-xl">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                    </span>
                    {lang === 'hi' ? 'मुफ़्त एआई दूसरी राय' : 'Free AI Second Opinion'}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    {lang === 'hi' ? 'क्या आपको सच में सर्जरी की आवश्यकता है?' : 'Do You Really Need Surgery?'}
                </h2>
                <p className="text-slate-500 font-medium max-w-xl mx-auto text-base md:text-lg">
                    {lang === 'hi' 
                        ? 'अपनी एमआरआई, एक्स-रे या डॉक्टर की पर्ची अपलोड करें। हमारा उन्नत एआई तुरंत विश्लेषण करेगा कि क्या आपकी स्थिति को बिना सर्जरी के प्रबंधित किया जा सकता है।' 
                        : 'Upload your MRI, X-Ray, or Prescription. Our clinical AI will instantly analyze your report to determine if your condition can be managed without surgery.'}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    {lang === 'hi' ? 'अनावश्यक सर्जरी से 100% सुरक्षा' : '100% Protection from Unnecessary Surgery'}
                </div>
            </div>

            <div 
                className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all ${
                    file ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    aria-label="Upload medical report image"
                />
                
                {preview ? (
                    <div className="space-y-6">
                        <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <Image src={preview} alt="Medical prescription or diagnostic report preview for AI analysis" fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="text-white text-xs font-bold uppercase tracking-wider"
                                    aria-label="Remove uploaded image"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{file?.name}</p>
                            <p className="text-xs text-slate-500">{(file?.size! / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {lang === 'hi' ? 'रिपोर्ट का विश्लेषण कर रहा है...' : 'Analyzing Report...'}
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    {lang === 'hi' ? 'विश्लेषण शुरू करें' : 'Start Analysis'}
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div 
                        className="space-y-4 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-lg">
                                {lang === 'hi' ? 'अपलोड करने के लिए क्लिक करें या ड्रैग करें' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                                JPG, PNG (Max 5MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            
            <p className="text-xs text-slate-400 text-center mt-6">
                {lang === 'hi' 
                    ? 'आपका डेटा एन्क्रिप्टेड है और DPDP अधिनियम के अनुसार सुरक्षित है।' 
                    : 'Your data is encrypted and secure as per the DPDP Act.'}
            </p>
        </div>
    );
}
