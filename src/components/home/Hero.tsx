import { ArrowRight, Shield, Star, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// Converted from 'use client' to a pure Server Component.
// This eliminates the JS hydration cost for the hero, drastically improving FCP/LCP.
// Navigation is handled with <Link> instead of JS onClick.
export function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-[#022c22] overflow-hidden">
      {/* Static Background - removed heavy animate-pulse blur which was GPU-intensive */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-teal-500/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-emerald-600/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Badge - visible immediately, no opacity-0 */}
          <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-premium">
            <Sparkles className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span className="text-xs md:text-sm font-bold tracking-wider text-teal-50 uppercase">
              {lang === 'hi' ? 'भारत का प्रीमियम सर्जरी नेटवर्क' : "India's Elite Surgery Network"}
            </span>
          </div>

          {/* H1 — critical LCP element: fully visible on first paint, no opacity-0 */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-8 text-white tracking-tight">
            {dict.title.split(' ').slice(0, 3).join(' ')}
            <span className="block mt-2 bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-400 bg-clip-text text-transparent">
              {dict.title.split(' ').slice(3).join(' ')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-teal-50/70 mb-12 max-w-2xl leading-relaxed font-medium">
            {dict.subtitle}
          </p>

          {/* CTA Buttons — <Link> instead of JS onClick for instant navigation */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-14 w-full">
            <Link
              href={`/${lang}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold text-lg rounded-[1.5rem] shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] hover:scale-[1.02] transition-all active:scale-95 border border-teal-300/30"
            >
              {lang === 'hi' ? 'लागत अनुमान प्राप्त करें' : 'Get Luxury Care Estimate'}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Link
              href={`/${lang}/surgeries`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-[1.5rem] hover:bg-white/20 transition-all active:scale-95"
            >
              {dict.cta_find}
            </Link>
          </div>

          {/* Trust tags — static, no JS needed */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Shield, text: lang === 'hi' ? 'कोई छिपी हुई फीस नहीं' : 'No Hidden Fees' },
              { icon: Star, text: lang === 'hi' ? 'शीर्ष रेटेड डॉक्टर' : 'Top Rated Surgeons' },
              { icon: CheckCircle, text: lang === 'hi' ? 'पूरी तरह निजी' : '100% Confidential' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-100/80 text-sm font-medium">
                <Icon className="w-4 h-4 text-teal-400" aria-hidden="true" />
                {text}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
