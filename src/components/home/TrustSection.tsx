'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, CircleDollarSign, Handshake } from 'lucide-react';

const trustPoints = [
    {
        icon: ShieldCheck,
        title: 'Privacy Protected',
        description: 'Strict confidentiality',
    },
    {
        icon: Trophy,
        title: '500+ Hospitals',
        description: 'Top providers across India',
    },
    {
        icon: CircleDollarSign,
        title: 'Transparent Pricing',
        description: 'No hidden charges',
    },
    {
        icon: Handshake,
        title: 'End-to-End Support',
        description: 'Admission to recovery',
    },
];

export default function TrustSection() {
    return (
        <section className="py-20 bg-slate-900 text-white rounded-t-[3rem] mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {trustPoints.map((point, idx) => (
                        <motion.div
                            key={point.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="text-center"
                        >
                            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-teal-400 mb-4">
                                <point.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">{point.title}</h3>
                            <p className="text-sm text-slate-400">{point.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
