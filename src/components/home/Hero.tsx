'use client';

import { ArrowRight, Shield, Star, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import HeroInquiryForm from './HeroInquiryForm';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-[#022c22] overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[0%] right-[-5%] w-[50%] h-[70%] bg-teal-500/15 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-emerald-600/15 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 mt-8 md:mt-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">

          {/* Left Column - Copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-8">

            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-premium">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-teal-50 uppercase">
                {lang === 'hi' ? 'भारत का प्रीमियम सर्जरी नेटवर्क' : "India's Elite Surgery Network"}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-3 text-white tracking-tight">
              {dict.title.split(' ').slice(0, 3).join(' ')}
              <span className="block mt-1.5 bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-400 bg-clip-text text-transparent pb-1">
                {dict.title.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="text-sm md:text-base text-teal-50/70 mb-5 max-w-xl leading-relaxed font-medium">
              {dict.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mb-6 w-full sm:w-auto">
              <button
                onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-400 to-teal-600 border border-teal-300/30 text-white font-bold text-base md:text-lg rounded-2xl hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_20px_rgba(45,212,191,0.3)] lg:hidden"
              >
                {dict.cta_book}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
              </button>

              <a
                href="https://wa.me/919307861041?text=Hi, I need help with surgery or hospital admission."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base md:text-lg rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.347-.272.271-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                {dict.cta_whatsapp}
              </a>
            </div>

            {/* Value Proposition Bullets */}
            <div className="flex flex-col gap-2">
              {dict.bullets?.map((text: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-teal-50/90 text-sm md:text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column - Form */}
          <div id="hero-form" className="relative w-full max-w-md mx-auto lg:max-w-lg lg:ml-auto">
             <HeroInquiryForm />
          </div>

        </div>
      </div>
    </section>
  );
}
