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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 mt-12 md:mt-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column - Copy */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-premium">
              <Sparkles className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span className="text-xs md:text-sm font-bold tracking-wider text-teal-50 uppercase">
                {lang === 'hi' ? 'भारत का प्रीमियम सर्जरी नेटवर्क' : "India's Elite Surgery Network"}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white tracking-tight">
              {dict.title.split(' ').slice(0, 3).join(' ')}
              <span className="block mt-2 bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-400 bg-clip-text text-transparent pb-2">
                {dict.title.split(' ').slice(3).join(' ')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-teal-50/70 mb-10 max-w-2xl leading-relaxed font-medium">
              {dict.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12 w-full sm:w-auto">
              <Link
                href={`/${lang}/surgeries`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                {dict.cta_find}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Trust tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
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

          {/* Right Column - Form */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
             <HeroInquiryForm />
          </div>

        </div>
      </div>
    </section>
  );
}
