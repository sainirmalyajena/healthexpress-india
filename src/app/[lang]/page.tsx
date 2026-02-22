import Link from 'next/link';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Category } from '@/generated/prisma';
import dynamic from 'next/dynamic';
import { getDictionary } from '@/get-dictionary';
import { Hero } from '@/components/home/Hero';
import type { Locale } from '@/i18n-config';

const categories = Object.values(Category);

// Lazy load non-critical sections to improve initial page load performance
const DynamicHowItWorks = dynamic(() => import('@/components/home/HowItWorks'), {
  ssr: true,
  loading: () => <div className="py-16 bg-white min-h-[400px] animate-pulse"></div>
});

const DynamicTrustSection = dynamic(() => import('@/components/home/TrustSection'), {
  ssr: true,
  loading: () => <div className="py-20 bg-slate-900 rounded-t-[3rem] mt-8 min-h-[200px] animate-pulse"></div>
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

      {/* Categories Section - Mobile Optimized Grid */}
      <section className="py-12 md:py-24 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${lang}/surgeries?category=${category}`}
                className="group p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 text-center flex flex-col items-center justify-center h-32 md:h-40"
              >
                <div className="text-teal-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <CategoryIcon category={category} className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-slate-700 group-hover:text-teal-700 leading-tight">
                  {getCategoryLabel(category, dict.categories)}
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

      {/* CTA Bottom - Enhanced */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            {dict.cta.title}
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
            {dict.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href={`/${lang}/contact`} className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
              {dict.cta.estimate}
            </Link>
            <a href="tel:9307861041" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              {dict.cta.call}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
