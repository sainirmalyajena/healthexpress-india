'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, CircleDollarSign, Handshake } from 'lucide-react';

interface TrustSectionProps {
    lang: string;
    dict: any;
}

export default function TrustSection({ lang, dict }: TrustSectionProps) {
    const trustPoints = [
        {
            icon: ShieldCheck,
            title: dict.point1_title,
            description: dict.point1_desc,
        },
        {
            icon: Trophy,
            title: dict.point2_title,
            description: dict.point2_desc,
        },
        {
            icon: CircleDollarSign,
            title: dict.point3_title,
            description: dict.point3_desc,
        },
        {
            icon: Handshake,
            title: dict.point4_title,
            description: dict.point4_desc,
        },
    ];

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
