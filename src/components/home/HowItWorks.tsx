'use client';

import { MessageSquare, ShieldCheck, Building2, CalendarCheck, HeartHandshake, Sparkles } from 'lucide-react';

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
            icon: MessageSquare,
        },
        {
            number: '02',
            title: dict.step2_title,
            description: dict.step2_desc,
            icon: ShieldCheck,
        },
        {
            number: '03',
            title: dict.step3_title,
            description: dict.step3_desc,
            icon: Building2,
        },
        {
            number: '04',
            title: dict.step4_title,
            description: dict.step4_desc,
            icon: CalendarCheck,
        },
        {
            number: '05',
            title: dict.step5_title,
            description: dict.step5_desc,
            icon: HeartHandshake,
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-4 h-4" />
                        {lang === 'hi' ? 'प्रक्रिया' : 'The Experience'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {dict.title}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        {dict.subtitle}
                    </p>
                </div>

                {/* Steps Timeline */}
                <div className="relative">
                    {/* Connector Line */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="relative group text-center">
                                {/* Visual Anchor */}
                                <div className="flex flex-col items-center mb-8 relative z-10">
                                   <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:shadow-md group-hover:-translate-y-1 relative">
                                      <step.icon className="w-8 h-8 text-teal-600" />
                                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-4 ring-slate-50">
                                         {step.number}
                                      </div>
                                   </div>
                                </div>

                                {/* Content Card */}
                                <div className="px-2">
                                   <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">
                                      {lang === 'hi' ? 'चरण' : 'Phase'} {step.number}
                                   </div>
                                   <h3 className="text-xl font-bold text-slate-900 mb-3">
                                      {step.title}
                                   </h3>
                                   <p className="text-slate-600 text-sm leading-relaxed">
                                      {step.description}
                                   </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

