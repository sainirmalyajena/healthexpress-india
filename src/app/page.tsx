'use client';

import Link from 'next/link';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Category } from '@/generated/prisma';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

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
  ssr: true, // Keeping SSR enabled for SEO while chunking JS
  loading: () => <div className="py-16 bg-white min-h-[300px] animate-pulse"></div>
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white overflow-hidden pb-16 pt-20 md:py-32">
        {/* Abstract shapes for premium feel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
        ></motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-800/50 border border-teal-500/30 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span className="text-xs md:text-sm font-medium text-teal-100">India&apos;s Most Trusted Surgery Partner</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight"
            >
              Expert Surgical Care <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
                Simplified & Affordable
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              We connect you with 500+ accredited hospitals. Get transparent cost estimates and end-to-end support for your surgery journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4 px-4"
            >
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white text-teal-800 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Get Cost Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/surgeries"
                className="w-full sm:w-auto px-8 py-4 bg-teal-900/40 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-teal-500/30 hover:bg-teal-900/60 transition-all active:scale-95"
              >
                Find Surgery
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section - Mobile Optimized Grid */}
      <section className="py-12 md:py-24 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/surgeries?category=${category}`}
                className="group p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 text-center flex flex-col items-center justify-center h-32 md:h-40"
              >
                <div className="text-teal-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <CategoryIcon category={category} className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-slate-700 group-hover:text-teal-700 leading-tight">
                  {getCategoryLabel(category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <DynamicHowItWorks />
      <DynamicTrustSection />
      <DynamicTestimonials />

      {/* CTA Bottom - Enhanced */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Start Your Recovery Today</h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
            Don&apos;t let cost or confusion delay your treatment. Talk to our health experts now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/contact" className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
              Talk to an Expert
            </Link>
            <a href="tel:9307861041" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Call 93078-61041
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
