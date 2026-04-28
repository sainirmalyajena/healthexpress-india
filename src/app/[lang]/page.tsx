import Link from 'next/link';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import dynamic from 'next/dynamic';
import { getDictionary } from '@/get-dictionary';
import { Hero } from '@/components/home/Hero';
import type { Locale } from '@/i18n-config';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

const categories = [
  'GENERAL_SURGERY',
  'ORTHOPEDICS',
  'UROLOGY',
  'ENT',
  'GYNECOLOGY',
  'OPHTHALMOLOGY',
  'CARDIAC',
  'NEURO',
  'GASTRO',
  'DENTAL',
  'COSMETIC',
  'PEDIATRIC'
];

const DynamicHowItWorks = dynamic(() => import('@/components/home/HowItWorks'), {
  ssr: true,
  loading: () => <div className="py-24 bg-white min-h-[400px] animate-pulse"></div>
});

const DynamicTrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  ssr: true,
  loading: () => <div className="py-32 bg-[#051c18] min-h-[600px] animate-pulse"></div>
});

const DynamicTestimonials = dynamic(() => import('@/components/home/Testimonials'), {
  ssr: true,
  loading: () => <div className="py-24 bg-white min-h-[400px] animate-pulse"></div>
});

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      {/* Hero Section */}
      <Hero lang={lang} dict={dict.hero} />

      {/* Surgery Categories Section - Precision Grid */}
      <section className="py-24 md:py-36 bg-[#fdfdfd] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section header */}
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-black uppercase tracking-[0.3em] mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'सर्जरी श्रेणियां' : 'Specialized Care'}
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-none tracking-tight">
                  {lang === 'hi' ? 'अपनी सर्जरी खोजें' : 'Expertise Across Specialties.'}
                </h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium">
                  {lang === 'hi' ? 'हम सभी प्रमुख सर्जरी प्रकारों में आपकी मदद करते हैं' : 'World-class surgical care across all major disciplines.'}
                </p>
            </div>
            <Link
                href={`/${lang}/surgeries`}
                className="group flex items-center gap-4 text-teal-600 font-black text-xs uppercase tracking-[0.3em] hover:text-teal-900 transition-colors"
            >
                {lang === 'hi' ? 'सभी देखें' : 'View Full Directory'}
                <div className="w-10 h-10 rounded-full border border-teal-100 flex items-center justify-center group-hover:bg-teal-50 transition-all">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/${lang}/surgeries?category=${category}`}
                className="group relative h-48 md:h-56 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-2 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden"
              >
                {/* Elite Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon with Dynamic Color */}
                <div
                  className="relative w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 shadow-lg"
                  style={{
                    background: `hsl(${(index * 43) % 360}, 65%, 55%)`,
                    boxShadow: `0 12px 24px -8px hsla(${(index * 43) % 360}, 65%, 55%, 0.4)`
                  }}
                >
                  <CategoryIcon category={category} className="w-8 h-8" />
                </div>
                
                <span className="relative text-sm md:text-base font-black text-slate-800 tracking-tight leading-tight group-hover:text-teal-700 transition-colors">
                  {getCategoryLabel(category, dict.categories)}
                </span>
                
                {/* Subsidiary detail */}
                <span className="relative mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <div className="space-y-0">
        <DynamicHowItWorks lang={lang} dict={dict.how_it_works} />
        <DynamicTrustSection lang={lang} dict={dict.trust} />
        <DynamicTestimonials lang={lang} dict={dict.testimonials} />
      </div>

      {/* Cinematic Bottom CTA */}
      <section className="py-24 md:py-40 bg-[#fdfdfd] px-4">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-slate-900 p-12 md:p-24 text-center text-white shadow-premium relative overflow-hidden">
          {/* Visual Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[90px] translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-teal-400 text-xs font-black uppercase tracking-[0.4em] mb-10">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
              </span>
              {lang === 'hi' ? 'मुफ़्त परामर्श' : 'Immediate Access'}
            </div>

            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter">
              {dict.cta.title}
            </h2>
            <p className="text-slate-400 mb-14 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              {dict.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href={`/${lang}/contact`}>
                <Button 
                  variant="glow" 
                  size="xl" 
                  className="px-12 w-full sm:w-auto"
                >
                  {dict.cta.estimate}
                </Button>
              </Link>
              <a
                href="tel:9307861041"
                className="group flex items-center justify-center gap-4 px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-base rounded-[1.5rem] hover:bg-white/20 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5 text-teal-400 transition-transform group-hover:rotate-12" />
                {dict.cta.call}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

