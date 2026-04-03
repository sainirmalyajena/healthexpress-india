'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, Shield, Star, CheckCircle, Sparkles } from 'lucide-react';
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

          {/* Right: Visual Experience */}
          <div className="hero-reveal relative lg:block">
            <div className="relative group">
              {/* Main Visual with Elite Border */}
              <div className="relative rounded-[3rem] overflow-hidden luxury-border shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <Image 
                  src="/hero-elite.png" 
                  alt="Premium Healthcare"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Experience Card */}
                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl border border-white/20 shadow-premium animate-bounce-subtle">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-teal-800 font-black uppercase tracking-widest mb-1">Total Care</p>
                          <p className="text-lg font-bold text-slate-900">Patient Success Rate</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-3xl font-black text-teal-600">
                          <AnimatedCounter end={99} suffix="%" />
                        </p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Subsidiary Floating Cards */}
              <div className="absolute -top-6 -right-6 glass-dark p-5 rounded-2xl border border-white/10 shadow-premium animate-reveal delay-300">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-teal-900 bg-teal-800 overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" width={32} height={32} unoptimized />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white leading-none">10K+</p>
                    <p className="text-[10px] text-teal-200 uppercase tracking-tighter">Verified Reviews</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 glass-dark px-6 py-4 rounded-3xl border border-emerald-500/20 shadow-2xl animate-reveal delay-500 hidden md:block">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                       <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Trust Protocol</p>
                      <p className="text-sm font-bold text-white">NABH Gold Standards</p>
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

