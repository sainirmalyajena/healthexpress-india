'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Trophy, CircleDollarSign, Handshake, Star, ArrowRight, CheckCircle } from 'lucide-react';
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
            <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight group-hover:text-teal-300 transition-colors">
                {prefix}{count.toLocaleString()}{suffix}
            </div>
            <div className="text-teal-50/70 text-xs font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}

export default function TrustSection({ lang, dict }: TrustSectionProps) {
    const trustPoints = [
        { icon: ShieldCheck, title: dict.point1_title, description: dict.point1_desc, color: 'text-teal-400', bg: 'bg-teal-400/10' },
        { icon: Trophy, title: dict.point2_title, description: dict.point2_desc, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { icon: CircleDollarSign, title: dict.point3_title, description: dict.point3_desc, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { icon: Handshake, title: dict.point4_title, description: dict.point4_desc, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];
    const hospitals = ['Manipal', 'ASG Eye Hospital', 'Mumbai Eye Care'];
    return (
        <section className="bg-slate-900 relative py-16 md:py-24 overflow-hidden border-t border-slate-800">
            {/* Visual Continuity Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Stats Bar Integrated with Glassmorphism */}
                <div className="bg-slate-800/50 backdrop-blur-md p-10 md:p-12 rounded-3xl border border-slate-700/50 mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <AnimatedStat end={10} suffix="+" label={lang === 'hi' ? 'पार्टनर अस्पताल' : 'Elite Hospitals'} />
                        <AnimatedStat end={2} suffix="+" label={lang === 'hi' ? 'शहर' : 'Cities'} />
                        <AnimatedStat end={100} suffix="+" label={lang === 'hi' ? 'सफल मरीज' : 'Patient Success'} />
                        <AnimatedStat prefix="₹" end={0} suffix="" label={lang === 'hi' ? 'परामर्श' : 'Consultation'} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                   {/* Left: Textual Authority */}
                   <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold mb-6 w-fit">
                            <Star className="w-4 h-4 fill-teal-400" />
                            {lang === 'hi' ? 'भारत का प्रीमियम विकल्प' : 'The Premium Choice for Care'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            {lang === 'hi' ? 'भारत का सबसे भरोसेमंद स्वास्थ्य सेवा मंच' : 'International Standards of Surgical Care.'}
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {trustPoints.map((point) => (
                                <div key={point.title} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                    <div className={`w-12 h-12 ${point.bg} rounded-xl flex items-center justify-center mb-5`}>
                                        <point.icon className={`w-6 h-6 ${point.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6">
                           <Button variant="primary" size="lg" className="rounded-xl px-8 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold">
                              {lang === 'hi' ? 'संपर्क करें' : 'Private Concierge'}
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                           <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span className="text-sm font-bold text-white uppercase tracking-widest">NABH Verified</span>
                           </div>
                        </div>
                   </div>

                   {/* Right: Immersive Visual */}
                   <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
                        <Image 
                            src="/trust-elite.png" 
                            alt="Luxury Healthcare Facility" 
                            width={800} 
                            height={900}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-8 left-8 right-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                            <p className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2">Facility Standard</p>
                            <h4 className="text-xl font-bold text-white mb-2">Wait Times Reduced by 85%</h4>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                Experience immediate access to Indias leading surgical specialists without the wait.
                            </p>
                        </div>
                   </div>
                </div>

                {/* Network Partners with premium styling */}
                <div className="mt-24 pt-16 border-t border-slate-800">
                    <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-10">
                        {lang === 'hi' ? 'हमारे पार्टनर नेटवर्क' : 'Elite Hospital Network Partners'}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {hospitals.map((hospital) => (
                            <span key={hospital} className="text-2xl font-bold text-slate-400 hover:text-white transition-colors cursor-default">
                                {hospital}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


