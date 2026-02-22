'use client';

import { motion } from 'framer-motion';
import { Search, UserRound, Building2 } from 'lucide-react';

interface HowItWorksProps {
    lang: string;
    dict: any;
}

export default function HowItWorks({ lang, dict }: HowItWorksProps) {
    const steps = [
        {
            number: '01',
            title: dict.step1_title,
            description: dict.step1_desc,
            icon: Search,
        },
        {
            number: '02',
            title: dict.step2_title,
            description: dict.step2_desc,
            icon: UserRound,
        },
        {
            number: '03',
            title: dict.step3_title,
            description: dict.step3_desc,
            icon: Building2,
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                        {dict.title}
                    </h2>
                    <p className="text-slate-500">{dict.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative bg-slate-50 rounded-3xl p-8 hover:bg-teal-50/50 transition-colors border border-slate-100"
                        >
                            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-teal-600">
                                <step.icon className="w-7 h-7" />
                            </div>
                            <div className="text-xs font-bold text-teal-600 tracking-wider uppercase mb-2">
                                {lang === 'hi' ? 'चरण' : 'Step'} {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
