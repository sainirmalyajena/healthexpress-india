import Link from 'next/link';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Category } from '@/generated/prisma';
import dynamic from 'next/dynamic';
import { getDictionary } from '@/get-dictionary';
import { Hero } from '@/components/home/Hero';
import type { Locale } from '@/i18n-config';
import { ArrowRight, Phone } from 'lucide-react';

const categories = Object.values(Category);

const DynamicHowItWorks = dynamic(() => import('@/components/home/HowItWorks'), {
  ssr: true,
  loading: () => <div className="py-16 bg-white min-h-[400px] animate-pulse"></div>
});

const DynamicTrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  ssr: true,
  loading: () => <div className="py-20 bg-slate-900 min-h-[200px] animate-pulse"></div>
});

const DynamicTestimonials = dynamic(() => import('@/components/home/Testimonials'), {
  ssr: true,
  loading: () => <div className="py-16 bg-white min-h-[300px] animate-pulse"></div>
});

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero lang={lang} dict={dict.hero} />

      {/* Surgery Categories Section */}
      <section className="py-16 md:py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-4 border border-teal-100">
              🏥 {lang === 'hi' ? 'सर्जरी श्रेणियां' : 'Surgery Categories'}
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">
              {lang === 'hi' ? 'अपनी सर्जरी खोजें' : 'Find Your Surgery'}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
              {lang === 'hi' ? 'हम सभी प्रमुख सर्जरी प्रकारों में आपकी मदद करते हैं' : 'We help you across all major surgery types'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/${lang}/surgeries?category=${category}`}
                className="group relative p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-200 hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center h-36 md:h-44 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Colored icon container */}
                <div
                  className="relative w-14 h-14 mb-3 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `hsl(${(index * 37) % 360}, 65%, 55%)`,
                    boxShadow: `0 8px 20px hsla(${(index * 37) % 360}, 65%, 55%, 0.35)`
                  }}
                >
                  <CategoryIcon category={category} className="w-7 h-7" />
                </div>
                <span className="relative text-xs md:text-sm font-bold text-slate-700 group-hover:text-teal-700 leading-tight transition-colors">
                  {getCategoryLabel(category, dict.categories)}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${lang}/surgeries`}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-sm border border-teal-200 hover:border-teal-400 px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-100"
            >
              {lang === 'hi' ? 'सभी सर्जरी देखें' : 'Browse All Surgeries'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <div className="space-y-0">
        <DynamicHowItWorks lang={lang} dict={dict.how_it_works} />
        <DynamicTrustSection lang={lang} dict={dict.trust} />
        <DynamicTestimonials lang={lang} dict={dict.testimonials} />
      </div>

      {/* CTA Bottom */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 rounded-[2.5rem] p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-300 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
              </span>
              {lang === 'hi' ? 'मुफ़्त परामर्श उपलब्ध' : 'Free Consultation Available'}
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              {dict.cta.title}
            </h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
              {dict.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/contact`}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 font-bold rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">{dict.cta.estimate}</span>
              </Link>
              <a
                href="tel:9307861041"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {dict.cta.call}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
