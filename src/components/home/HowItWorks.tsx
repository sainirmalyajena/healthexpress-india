'use client';

import { motion } from 'framer-motion';
import { Search, UserRound, Building2 } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Find Your Surgery',
        description: 'Browse our comprehensive directory or search for the specific surgery you need.',
        icon: Search,
    },
    {
        number: '02',
        title: 'Get Expert Guidance',
        description: 'Our team connects you with the right hospital and specialist for your needs.',
        icon: UserRound,
    },
    {
        number: '03',
        title: 'Receive Quality Care',
        description: 'Get treated at partner hospitals with transparent pricing and support.',
        icon: Building2,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                        Your Journey to Recovery
                    </h2>
                    <p className="text-slate-500">Simple steps to get the best care</p>
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
                            <div className="text-xs font-bold text-teal-600 tracking-wider uppercase mb-2">Step {step.number}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
