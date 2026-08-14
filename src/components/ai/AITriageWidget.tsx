'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

interface TriageResult {
    diagnosisSummary: string;
    medicalTermsExplained: string[];
    recommendedSurgery: string;
    urgency: "High" | "Medium" | "Low";
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

    const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const phone = formData.get('phone') as string;

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: 'AI Triage User',
                    phone: phone,
                    city: 'Online',
                    description: `AI Triage Lead. Surgery Recommended: ${result?.recommendedSurgery}. Diagnosis: ${result?.diagnosisSummary}`,
                    sourcePage: 'ai_triage',
                    consent: true
                }),
            });

            if (response.ok) {
                setLeadSubmitted(true);
            }
        } catch (err) {
            console.error('Failed to submit lead', err);
        }
    };

    if (leadSubmitted) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {lang === 'hi' ? 'अनुरोध प्राप्त हुआ!' : 'Request Received!'}
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {lang === 'hi' 
                        ? 'हमारे मेडिकल विशेषज्ञ आपकी रिपोर्ट की समीक्षा कर रहे हैं और जल्द ही आपको कॉल करेंगे।' 
                        : 'Our medical experts are reviewing your report and will call you shortly.'}
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

    if (result) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <Activity className="w-6 h-6 text-teal-400" />
                        <h3 className="text-xl font-bold">{lang === 'hi' ? 'AI रिपोर्ट विश्लेषण' : 'AI Report Analysis'}</h3>
                    </div>
                    <p className="text-slate-400 text-sm relative z-10">
                        {lang === 'hi' ? 'यह एक AI-जनित सारांश है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।' : 'This is an AI-generated summary and not a substitute for professional medical advice.'}
                    </p>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                        <h4 className="font-bold text-slate-900 mb-2">{lang === 'hi' ? 'निष्कर्ष' : 'Summary'}</h4>
                        <p className="text-slate-700 leading-relaxed text-sm">{result.diagnosisSummary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">{lang === 'hi' ? 'अगले कदम' : 'Action Plan'}</h4>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{lang === 'hi' ? 'अनुशंसित सर्जरी' : 'Recommended Procedure'}</span>
                                    <span className="inline-block bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">
                                        {result.recommendedSurgery}
                                    </span>
                                </div>
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

                    <div className="border-t border-slate-100 pt-8 mt-8">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white text-center">
                            <h4 className="text-xl font-bold mb-2">
                                {lang === 'hi' ? 'विशेषज्ञ से परामर्श लें' : 'Consult a Specialist'}
                            </h4>
                            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
                                {lang === 'hi' 
                                    ? `हम आपको ${result.recommendedSurgery} के लिए सबसे अच्छे सर्जन से जोड़ सकते हैं। अभी अपना नंबर दर्ज करें।` 
                                    : `We can connect you with the best surgeon for ${result.recommendedSurgery}. Enter your number for a free consultation.`}
                            </p>
                            
                            <form onSubmit={handleLeadSubmit} className="max-w-sm mx-auto space-y-4">
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="+91 91234 56789"
                                    required
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
                                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {lang === 'hi' ? 'मुफ़्त कॉल बुक करें' : 'Book Free Call'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    {lang === 'hi' ? 'अपनी मेडिकल रिपोर्ट समझें' : 'Understand Your Medical Report'}
                </h2>
                <p className="text-slate-500 font-medium max-w-lg mx-auto">
                    {lang === 'hi' 
                        ? 'अपनी प्रिस्क्रिप्शन या टेस्ट रिपोर्ट की फोटो अपलोड करें और हमारा AI आपको सरल भाषा में समझाएगा कि आपको किस सर्जरी या उपचार की आवश्यकता हो सकती है।' 
                        : 'Upload a photo of your prescription or diagnostic report. Our AI will explain it in simple terms and recommend the right treatment path.'}
                </p>
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
                />
                
                {preview ? (
                    <div className="space-y-6">
                        <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Medical prescription or diagnostic report preview for AI analysis" className="w-full h-full object-cover" />
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
