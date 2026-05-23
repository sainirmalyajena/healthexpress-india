'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Star, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}



export function Hero({ lang, dict }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  // Removed JS-based intersection observer for critical hero content to prevent invisible text


  const trustTags = [
    { icon: Shield, text: lang === 'hi' ? 'कोई छिपी हुई फीस नहीं' : 'No Hidden Fees' },
    { icon: Star, text: lang === 'hi' ? 'शीर्ष रेटेड डॉक्टर' : 'Top Rated Surgeons' },
    { icon: CheckCircle, text: lang === 'hi' ? 'पूरी तरह निजी' : '100% Confidential' },
  ];

  return (
    <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center bg-[#022c22] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-emerald-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Main Content */}
          <div className="flex flex-col items-center">
            <div className="animate-reveal opacity-0 mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-premium" style={{ animationDelay: '0.1s' }}>
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs md:text-sm font-bold tracking-wider text-teal-50 uppercase">
                {lang === 'hi' ? 'भारत का प्रीमियम सर्जरी नेटवर्क' : "India's Elite Surgery Network"}
              </span>
            </div>

            <h1 className="animate-reveal opacity-0 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-8 text-white tracking-tight" style={{ animationDelay: '0.2s' }}>
              {dict.title.split(' ').slice(0, 3).join(' ')}
              <span className="block mt-2 bg-gradient-to-r from-teal-300 via-emerald-200 to-gold-500 bg-clip-text text-transparent">
                {dict.title.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="animate-reveal opacity-0 text-lg md:text-xl text-teal-50/70 mb-12 max-w-2xl leading-relaxed font-medium" style={{ animationDelay: '0.3s' }}>
              {dict.subtitle}
            </p>

            <div className="animate-reveal opacity-0 flex flex-col sm:flex-row justify-center gap-5 mb-14 w-full" style={{ animationDelay: '0.4s' }}>
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

          </div>

        </div>
      </div>

    </section>
  );
}

