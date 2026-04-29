'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, Shield, Star, CheckCircle, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
    <span ref={ref} className="font-outfit">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function Hero({ lang, dict }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    const raf = requestAnimationFrame(() => {
      section.classList.add('hero-ready');
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const trustTags = [
    { icon: Shield, text: lang === 'hi' ? 'कोई छिपी हुई फीस नहीं' : 'No Hidden Fees' },
    { icon: Star, text: lang === 'hi' ? 'शीर्ष रेटेड डॉक्टर' : 'Top Rated Surgeons' },
    { icon: CheckCircle, text: lang === 'hi' ? 'पूरी तरह निजी' : '100% Confidential' },
  ];

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center bg-[#022c22] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-emerald-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="text-left">
            <div className="hero-reveal mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-premium">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs md:text-sm font-bold tracking-wider text-teal-50 uppercase">
                {lang === 'hi' ? 'भारत का प्रीमियम सर्जरी नेटवर्क' : "India's Elite Surgery Network"}
              </span>
            </div>

            <h1 className="hero-reveal text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8 text-white tracking-tight">
              {dict.title.split(' ').slice(0, 3).join(' ')}
              <span className="block mt-2 bg-gradient-to-r from-teal-300 via-emerald-200 to-gold-500 bg-clip-text text-transparent">
                {dict.title.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="hero-reveal text-lg md:text-xl text-teal-50/70 mb-12 max-w-xl leading-relaxed font-medium">
              {dict.subtitle}
            </p>

            <div className="hero-reveal flex flex-col sm:flex-row gap-5 mb-12">
              <Button 
                variant="glow" 
                size="xl" 
                className="w-full sm:w-auto"
                onClick={() => window.location.href = `/${lang}/contact`}
              >
                {lang === 'hi' ? 'लागत अनुमान प्राप्त करें' : 'Get Luxury Care Estimate'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="glass" 
                size="xl" 
                className="w-full sm:w-auto"
                onClick={() => window.location.href = `/${lang}/surgeries`}
              >
                {dict.cta_find}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="hero-reveal flex flex-wrap gap-6 border-t border-white/10 pt-10">
              {trustTags.map((tag, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                    <tag.icon className="w-4 h-4 text-teal-300" />
                  </div>
                  <span className="text-sm font-semibold text-teal-50/80">{tag.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Smooth & Polished Visual Experience */}
          <div className="hero-reveal relative lg:block">
            <div className="relative group min-h-[500px] flex items-center justify-center">
              
              {/* Dynamic CSS Visual - Ultra Fast */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-[3rem] luxury-border overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1)_0%,transparent_50%)]" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/10 blur-[80px] rounded-full" />
                
                {/* Abstract Glassmorphic Grid */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              </div>

              {/* Smaller, Optimized Floating Image Card */}
              <div className="relative z-10 w-[85%] luxury-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-[1.03] group-hover:-translate-y-2">
                <div className="aspect-[4/3] bg-teal-900/50 relative">
                   <Image 
                    src="/hero-opt.png" 
                    alt="Trusted Healthcare Partner"
                    fill
                    className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/80 via-transparent to-transparent" />
                </div>
                
                {/* Embedded Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-2xl border border-white/10 shadow-premium">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] text-teal-800 font-black uppercase tracking-widest mb-0.5">Success Rate</p>
                          <p className="text-sm font-bold text-slate-900">Patient Satisfaction</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-teal-600">
                          <AnimatedCounter end={99} suffix="%" />
                        </p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Subsidiary Floating Badge */}
              <div className="absolute -top-6 -right-6 glass-dark p-4 rounded-2xl border border-white/10 shadow-premium animate-reveal delay-300">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-teal-900 bg-teal-800 flex items-center justify-center text-teal-300">
                        <Users className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white leading-none">10K+</p>
                    <p className="text-[9px] text-teal-200 uppercase tracking-tighter">Verified Reviews</p>
                  </div>
                </div>
              </div>

              {/* Protocol Badge */}
              <div className="absolute -bottom-8 -left-8 glass-dark px-5 py-3 rounded-2xl border border-emerald-500/20 shadow-2xl animate-reveal delay-500 hidden md:block">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                       <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-widest leading-none mb-1">Trust Protocol</p>
                      <p className="text-xs font-bold text-white">NABH Gold Standards</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-white/80" />
        <span className="text-[10px] text-white uppercase tracking-[0.3em] font-medium">Elevate</span>
      </div>
    </section>
  );
}

