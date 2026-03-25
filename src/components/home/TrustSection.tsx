'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Trophy, CircleDollarSign, Handshake, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TrustSectionProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

function AnimatedStat({ end, prefix = '', suffix = '', label }: { end: number; prefix?: string; suffix?: string; label: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let start = 0;
                    const duration = 2000;
                    const step = end / (duration / 16);
                    const timer = setInterval(() => {
                        start = Math.min(start + step, end);
                        setCount(Math.floor(start));
                        if (start >= end) clearInterval(timer);
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [end]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-1">
                {prefix}{count}{suffix}
            </div>
            <div className="text-slate-400 text-sm font-medium">{label}</div>
        </div>
    );
}

export default function TrustSection({ lang, dict }: TrustSectionProps) {
    const trustPoints = [
        { icon: ShieldCheck, title: dict.point1_title, description: dict.point1_desc, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        { icon: Trophy, title: dict.point2_title, description: dict.point2_desc, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
        { icon: CircleDollarSign, title: dict.point3_title, description: dict.point3_desc, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20' },
        { icon: Handshake, title: dict.point4_title, description: dict.point4_desc, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    ];

    const hospitals = ['Apollo', 'Fortis', 'Max', 'Medanta', 'AIIMS', 'Narayana', 'Manipal', 'Kokilaben'];

    return (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Glow orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

            {/* Stats bar */}
            <div className="border-b border-white/10 py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <AnimatedStat end={500} suffix="+" label={lang === 'hi' ? 'पार्टनर अस्पताल' : 'Partner Hospitals'} />
                        <AnimatedStat end={28} suffix="" label={lang === 'hi' ? 'शहरों में उपस्थित' : 'Cities Covered'} />
                        <AnimatedStat end={10000} suffix="+" label={lang === 'hi' ? 'सफल मरीज' : 'Patients Helped'} />
                        <AnimatedStat prefix="₹" end={0} suffix="" label={lang === 'hi' ? 'परामर्श शुल्क' : 'Consultation Fee'} />
                    </div>
                </div>
            </div>

            {/* Why choose us */}
            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-sm font-semibold mb-4">
                            <Star className="w-4 h-4 fill-teal-400" />
                            {lang === 'hi' ? 'हमें क्यों चुनें' : 'Why Choose Us'}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                            {lang === 'hi' ? 'भारत का सबसे भरोसेमंद\nस्वास्थ्य सेवा मंच' : 'Healthcare You Can\nTrust Completely'}
                        </h2>
                    </div>

                    {/* Trust cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                        {trustPoints.map((point, idx) => (
                            <div
                                key={point.title}
                                className={`${point.bg} border ${point.border} rounded-3xl p-6 hover:scale-[1.03] transition-transform`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className={`w-12 h-12 ${point.bg} rounded-2xl flex items-center justify-center mb-4`}>
                                    <point.icon className={`w-6 h-6 ${point.color}`} />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{point.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Hospital logos marquee */}
                    <div className="border-t border-white/10 pt-12">
                        <p className="text-center text-xs text-slate-500 font-semibold uppercase tracking-widest mb-8">
                            {lang === 'hi' ? 'हमारे पार्टनर अस्पताल' : 'Our Partner Hospital Networks'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {hospitals.map((hospital) => (
                                <div key={hospital} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <span className="text-slate-300 font-bold text-sm tracking-wide">{hospital}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-14">
                        <Link
                            href={`/${lang}/contact`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] hover:scale-105 transition-all"
                        >
                            {lang === 'hi' ? 'मुफ़्त परामर्श पाएं' : 'Get Free Consultation'}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
