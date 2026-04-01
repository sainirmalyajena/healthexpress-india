'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, Shield, Star, Clock, CheckCircle } from 'lucide-react';

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
          const duration = 1800;
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
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function Hero({ lang, dict }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  // Add hero-ready class after mount — triggers CSS animation without hiding content during LCP
  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    // rAF ensures the first paint happens before the animation class is applied;
    // this means Lighthouse sees fully-visible content at LCP time.
    const raf = requestAnimationFrame(() => {
      section.classList.add('hero-ready');
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const stats = [
    { value: 500, suffix: '+', label: lang === 'hi' ? 'अस्पताल' : 'Hospitals', icon: Shield },
    { value: 28, suffix: '', label: lang === 'hi' ? 'शहर' : 'Cities', icon: CheckCircle },
    { value: 10000, suffix: '+', label: lang === 'hi' ? 'सफल मरीज' : 'Patients Helped', icon: Star },
    { value: 0, prefix: '₹', suffix: '', label: lang === 'hi' ? 'परामर्श शुल्क' : 'Consultation Fee', icon: Clock },
  ];

  return (
    <section ref={heroRef} className="relative overflow-hidden pb-0 pt-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900" />

      {/* SVG mesh grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large glow orbs */}
      <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text — children carry .hero-reveal for staggered CSS animation */}
          <div>
            {/* Pill badge */}
            <div className="hero-reveal inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-teal-400/30 backdrop-blur-sm mb-8 text-white">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
              </span>
              <span className="text-xs md:text-sm font-medium text-teal-100">
                {lang === 'hi' ? 'भारत का सबसे भरोसेमंद सर्जरी पार्टनर' : "India's Most Trusted Surgery Partner"}
              </span>
            </div>

            {/* H1 — always visible for SSR & LCP; CSS animation adds motion after mount */}
            <h1 className="hero-reveal text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white">
              <span className="block">{dict.title.split(' ').slice(0, 3).join(' ')}</span>
              <span className="block bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-400 bg-clip-text text-transparent">
                {dict.title.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-reveal text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
              {dict.subtitle}
            </p>

            {/* CTA buttons */}
            <div className="hero-reveal flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${lang}/contact`}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:shadow-[0_0_60px_rgba(45,212,191,0.6)] hover:scale-[1.03] transition-all active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {lang === 'hi' ? 'लागत अनुमान प्राप्त करें' : 'Get Cost Estimate'}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href={`/${lang}/surgeries`}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
              >
                {dict.cta_find}
              </Link>
            </div>

            {/* Trust tags */}
            <div className="hero-reveal mt-10 flex flex-wrap gap-3">
              {['✅ No Hidden Fees', '🏥 Top Hospitals', '⚡ 24hr Callback', '🔒 100% Private'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs text-slate-300 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="hero-reveal relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-cyan-500/20 rounded-[2.5rem] blur-2xl scale-105" />

              {/* Main card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">HealthExpress</p>
                    <p className="text-teal-300 text-xs">Verified &amp; Trusted</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                      <p className="text-2xl font-black text-white mb-1">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                      </p>
                      <p className="text-xs text-slate-400 font-medium leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="space-y-3">
                  {[
                    { name: 'Rahul S.', city: 'Delhi', surgery: 'Knee Replacement', time: '2m ago' },
                    { name: 'Priya M.', city: 'Mumbai', surgery: 'Laparoscopy', time: '8m ago' },
                    { name: 'Anil K.', city: 'Bangalore', surgery: 'Cataract', time: '15m ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-t border-white/10">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {item.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.name} · {item.city}</p>
                        <p className="text-xs text-slate-400 truncate">{item.surgery}</p>
                      </div>
                      <span className="text-[10px] text-teal-400 font-medium flex-shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <a
                  href="tel:9307861041"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-teal-500/40 transition-shadow"
                >
                  <Phone className="w-4 h-4" />
                  Call Now: 93078-61041
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative h-16 md:h-24">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 27.5C840 35 960 40 1080 37.5C1200 35 1320 25 1380 20L1440 15V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
