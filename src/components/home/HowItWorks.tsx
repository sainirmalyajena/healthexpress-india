'use client';

import { Search, Phone, Building2, CheckCircle2, Sparkles } from 'lucide-react';

interface HowItWorksProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

export default function HowItWorks({ lang, dict }: HowItWorksProps) {
    const steps = [
        {
            number: '01',
            title: dict.step1_title,
            description: dict.step1_desc,
            icon: Search,
            color: 'teal',
        },
        {
            number: '02',
            title: dict.step2_title,
            description: dict.step2_desc,
            icon: Phone,
            color: 'gold',
        },
        {
            number: '03',
            title: dict.step3_title,
            description: dict.step3_desc,
            icon: Building2,
            color: 'emerald',
        },
    ];

    return (
        <section className="py-24 md:py-32 bg-[#fdfdfd] relative overflow-hidden">
            {/* Background Sophistication */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 md:mb-28">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-xs font-black uppercase tracking-[0.3em] mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        {lang === 'hi' ? 'प्रक्रिया' : 'The Experience'}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-none tracking-tight">
                        {dict.title}
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">{dict.subtitle}</p>
                </div>

                {/* Steps - Minimalist Elite Timeline */}
                <div className="relative">
                    {/* Stealth Connector */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                    <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="relative group">
                                {/* Visual Anchor */}
                                <div className="flex flex-col items-center mb-10">
                                   <div className="relative">
                                      <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                      <div className={`relative w-24 h-24 rounded-[2rem] bg-white border border-slate-100 shadow-premium flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                                         <step.icon className={`w-10 h-10 ${idx === 1 ? 'text-gold-500' : 'text-teal-600'}`} />
                                         <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg">
                                            {step.number}
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                {/* Content Card */}
                                <div className="text-center px-4">
                                   <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">
                                      {lang === 'hi' ? 'चरण' : 'Phase'} {step.number}
                                   </div>
                                   <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-teal-700 transition-colors">
                                      {step.title}
                                   </h3>
                                   <div className="w-12 h-1 bg-slate-100 mx-auto mb-6 group-hover:w-20 group-hover:bg-teal-200 transition-all duration-500" />
                                   <p className="text-slate-500 leading-[1.8] font-medium text-sm md:text-base">
                                      {step.description}
                                   </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Micro-Interaction Support */}
                <div className="mt-24 text-center">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Experience Concierge Care</p>
                   <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-teal-500 transition-colors" />
                      ))}
                   </div>
                </div>
            </div>
        </section>
    );
}

