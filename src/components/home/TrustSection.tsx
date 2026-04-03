'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Trophy, CircleDollarSign, Handshake, Star, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

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
                    const duration = 2500;
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
        <div ref={ref} className="text-center group">
            <div className="text-4xl md:text-6xl font-black text-white mb-2 font-outfit tracking-tighter group-hover:text-teal-300 transition-colors">
                {prefix}{count.toLocaleString()}{suffix}
            </div>
            <div className="text-teal-50/50 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{label}</div>
        </div>
    );
}

export default function TrustSection({ lang, dict }: TrustSectionProps) {
    const trustPoints = [
        { icon: ShieldCheck, title: dict.point1_title, description: dict.point1_desc, color: 'text-teal-400', bg: 'bg-teal-400/5', border: 'border-white/10' },
        { icon: Trophy, title: dict.point2_title, description: dict.point2_desc, color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-white/10' },
        { icon: CircleDollarSign, title: dict.point3_title, description: dict.point3_desc, color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-white/10' },
        { icon: Handshake, title: dict.point4_title, description: dict.point4_desc, color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-white/10' },
    ];

    const hospitals = ['Apollo', 'Fortis', 'Max', 'Medanta', 'AIIMS', 'Narayana', 'Manipal', 'Kokilaben'];

    return (
        <section className="bg-[#051c18] relative py-24 md:py-32 overflow-hidden">
            {/* Visual Continuity Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Stats Bar Integrated with Glassmorphism */}
                <div className="glass p-10 md:p-16 rounded-[3rem] border border-white/5 mb-24 shadow-premium">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <AnimatedStat end={500} suffix="+" label={lang === 'hi' ? 'पार्टनर अस्पताल' : 'Elite Hospitals'} />
                        <AnimatedStat end={28} suffix="" label={lang === 'hi' ? 'शहर' : 'Cities'} />
                        <AnimatedStat end={10000} suffix="+" label={lang === 'hi' ? 'सफल मरीज' : 'Patient Success'} />
                        <AnimatedStat prefix="₹" end={0} suffix="" label={lang === 'hi' ? 'परामर्श' : 'Consultation'} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-stretch">
                   {/* Left: Textual Authority */}
                   <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-teal-400/5 border border-teal-400/10 text-teal-400 text-sm font-bold mb-8 w-fit">
                            <Star className="w-4 h-4 fill-teal-400" />
                            {lang === 'hi' ? 'भारत का प्रीमियम विकल्प' : 'The Premium Choice for Care'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                            {lang === 'hi' ? 'भारत का सबसे भरोसेमंद\nस्वास्थ्य सेवा मंच' : 'International Standards\nof Surgical Care.'}
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {trustPoints.map((point) => (
                                <div key={point.title} className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className={`w-12 h-12 ${point.bg} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                                        <point.icon className={`w-6 h-6 ${point.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                                    <p className="text-sm text-teal-50/50 leading-relaxed">{point.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                           <Button variant="glow" size="lg" className="rounded-2xl px-10">
                              {lang === 'hi' ? 'संपर्क करें' : 'Private Concierge'}
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                           <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-teal-400" />
                              <span className="text-sm font-bold text-white uppercase tracking-widest">NABH Verified</span>
                           </div>
                        </div>
                   </div>

                   {/* Right: Immersive Visual */}
                   <div className="relative rounded-[4rem] overflow-hidden luxury-border shadow-2xl">
                        <Image 
                            src="/images/home/trust-hospital.png" 
                            alt="Luxury Healthcare Facility" 
                            width={800} 
                            height={1000}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#051c18] via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10 glass p-8 rounded-[2.5rem]">
                            <p className="text-teal-400 font-black text-xs uppercase tracking-[0.3em] mb-3">Facility Standard</p>
                            <h4 className="text-2xl font-bold text-teal-900 mb-2">Wait Times Reduced by 85%</h4>
                            <p className="text-sm text-teal-900/70 font-medium leading-relaxed">
                                Experience immediate access to Indias leading surgical specialists without the wait.
                            </p>
                        </div>
                   </div>
                </div>

                {/* Network Partners with premium styling */}
                <div className="mt-32 pt-20 border-t border-white/5">
                    <p className="text-center text-[10px] text-teal-50/40 font-black uppercase tracking-[0.4em] mb-12">
                        {lang === 'hi' ? 'हमारे पार्टनर नेटवर्क' : 'Elite Hospital Network Partners'}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {hospitals.map((hospital) => (
                            <span key={hospital} className="text-2xl font-black text-white/40 font-outfit hover:text-white transition-colors cursor-default">
                                {hospital.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

