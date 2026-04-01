'use client';

import { Search, Phone, Building2, CheckCircle2 } from 'lucide-react';

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
            color: 'from-violet-500 to-purple-600',
            glow: 'shadow-violet-500/30',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
        },
        {
            number: '02',
            title: dict.step2_title,
            description: dict.step2_desc,
            icon: Phone,
            color: 'from-teal-500 to-emerald-600',
            glow: 'shadow-teal-500/30',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
        },
        {
            number: '03',
            title: dict.step3_title,
            description: dict.step3_desc,
            icon: Building2,
            color: 'from-blue-500 to-cyan-600',
            glow: 'shadow-blue-500/30',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 right-10 w-72 h-72 bg-teal-100/60 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        {lang === 'hi' ? 'सरल प्रक्रिया' : 'Simple Process'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                        {dict.title}
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">{dict.subtitle}</p>
                </div>

                {/* Steps - connected timeline */}
                <div className="relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-violet-200 via-teal-200 to-blue-200 z-0" />

                    <div className="grid md:grid-cols-3 gap-6 md:gap-10">
                        {steps.map((step, idx) => (
                            <div
                                key={step.number}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Step number ring */}
                                <div className={`relative w-20 h-20 mb-8 z-10`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full opacity-20 scale-125 group-hover:opacity-30 transition-opacity`} />
                                    <div className={`relative w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl ${step.glow} group-hover:scale-110 transition-transform`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-slate-600">{step.number}</span>
                                    </div>
                                </div>

                                {/* Card */}
                                <div className={`w-full ${step.bg} border ${step.border} rounded-3xl p-7 group-hover:shadow-xl group-hover:-translate-y-1 transition-all`}>
                                    <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">
                                        {lang === 'hi' ? 'चरण' : 'Step'} {step.number}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div
                    className="text-center mt-14"
                >
                    <a
                        href="tel:9307861041"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-teal-700 transition-colors shadow-xl hover:shadow-teal-700/30"
                    >
                        <Phone className="w-5 h-5" />
                        {lang === 'hi' ? 'अभी कॉल करें: 93078-61041' : 'Call Now: 93078-61041'}
                    </a>
                </div>
            </div>
        </section>
    );
}
