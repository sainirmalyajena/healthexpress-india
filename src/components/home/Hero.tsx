'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
    lang: string;
    dict: any;
}

export function Hero({ lang, dict }: HeroProps) {
    return (
        <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white overflow-hidden pb-16 pt-20 md:py-32">
            {/* Abstract shapes for premium feel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            ></motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
            ></motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-800/50 border border-teal-500/30 backdrop-blur-sm mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        <span className="text-xs md:text-sm font-medium text-teal-100">
                            {lang === 'hi' ? 'भारत का सबसे भरोसेमंद सर्जरी पार्टनर' : "India's Most Trusted Surgery Partner"}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight"
                    >
                        {dict.title.split('<br />').map((text: string, i: number) => (
                            <span key={i}>
                                {text}
                                {i === 0 && <br className="hidden md:block" />}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        {dict.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 px-4"
                    >
                        <Link
                            href={`/${lang}/contact`}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-teal-800 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {lang === 'hi' ? 'लागत अनुमान प्राप्त करें' : 'Get Cost Estimate'}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href={`/${lang}/surgeries`}
                            className="w-full sm:w-auto px-8 py-4 bg-teal-900/40 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-teal-500/30 hover:bg-teal-900/60 transition-all active:scale-95"
                        >
                            {dict.cta_find}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
