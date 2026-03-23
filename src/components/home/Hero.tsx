'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function Hero({ lang, dict }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Intersection Observer based reveal — no framer-motion SSR flash
  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('[data-reveal]');
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white overflow-hidden pb-16 pt-20 md:py-32">
      {/* Background orbs — CSS only, no framer-motion */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">

          {/* Pill badge */}
          <div
            data-reveal
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-800/50 border border-teal-500/30 backdrop-blur-sm mb-8"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-teal-100">
              {lang === 'hi' ? 'भारत का सबसे भरोसेमंद सर्जरी पार्टनर' : "India's Most Trusted Surgery Partner"}
            </span>
          </div>

          {/* H1 */}
          <h1
            data-reveal
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            {dict.title}
          </h1>

          {/* Subtitle */}
          <p
            data-reveal
            className="text-lg md:text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            {dict.subtitle}
          </p>

          {/* CTA buttons */}
          <div
            data-reveal
            className="flex flex-col sm:flex-row justify-center gap-4 px-4"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
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
          </div>

          {/* Social proof strip */}
          <div
            data-reveal
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-teal-200"
            style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-teal-400 font-bold">500+</span> Partner Hospitals
            </span>
            <span className="hidden sm:block w-px h-4 bg-teal-600" />
            <span className="flex items-center gap-1.5">
              <span className="text-teal-400 font-bold">28</span> Cities Covered
            </span>
            <span className="hidden sm:block w-px h-4 bg-teal-600" />
            <span className="flex items-center gap-1.5">
              <span className="text-teal-400 font-bold">₹0</span> Consultation Fee
            </span>
            <span className="hidden sm:block w-px h-4 bg-teal-600" />
            <a
              href="tel:9307861041"
              className="flex items-center gap-1.5 text-white hover:text-teal-200 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              93078-61041
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
