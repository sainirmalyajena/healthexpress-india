'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, CalendarCheck } from 'lucide-react';

interface StickyMobileCTAProps {
    lang: string;
    dict: any;
}

export default function StickyMobileCTA({ lang, dict }: StickyMobileCTAProps) {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:hidden flex gap-3 w-full pb-safe-offset-4 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]"
        >
            <motion.a
                whileTap={{ scale: 0.96 }}
                href="tel:+919307861041"
                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl active:bg-slate-50 transition-colors shadow-sm"
            >
                <Phone className="w-4 h-4" />
                <span>{dict.call}</span>
            </motion.a>
            <motion.div
                whileTap={{ scale: 0.96 }}
                className="flex-1"
            >
                <Link
                    href={`/${lang}/contact`}
                    className="flex w-full items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3.5 rounded-xl active:bg-teal-700 transition-colors shadow-lg shadow-teal-100"
                >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{dict.book}</span>
                </Link>
            </motion.div>
        </motion.div>
    );
}
