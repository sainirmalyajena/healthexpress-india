'use client';

import { useState } from 'react';
import { Search, ArrowRight, Shield, Star, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeroProps {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const quickServices = [
  { label: 'Eye Surgery', icon: '👁️', href: '/surgeries?category=OPHTHALMOLOGY', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
  { label: 'Orthopaedics', icon: '🦴', href: '/surgeries?category=ORTHOPEDICS', color: 'bg-orange-50 hover:bg-orange-100 border-orange-100' },
  { label: 'Heart Care', icon: '❤️', href: '/surgeries?category=CARDIAC', color: 'bg-red-50 hover:bg-red-100 border-red-100' },
  { label: 'Urology', icon: '🫘', href: '/surgeries?category=UROLOGY', color: 'bg-teal-50 hover:bg-teal-100 border-teal-100' },
  { label: 'Gynecology', icon: '🌸', href: '/surgeries?category=GYNECOLOGY', color: 'bg-pink-50 hover:bg-pink-100 border-pink-100' },
  { label: 'General Surgery', icon: '🏥', href: '/surgeries?category=GENERAL_SURGERY', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
];

const popularSearches = ['LASIK Eye Surgery', 'Cataract Surgery', 'Knee Replacement', 'Appendix Surgery', 'Hernia Surgery'];

export function Hero({ lang }: HeroProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/surgeries?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white pt-10 pb-16 md:pt-16 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Badge Row */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            India&apos;s Most Trusted Surgery Assistance Platform
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-4">
            Expert Surgery Guidance,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
              Right at Your Fingertips
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Find the right surgery, the right hospital, and the right surgeon across India. Free consultation, cashless insurance assistance, and doorstep support.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-4">
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:border-teal-400 focus-within:border-teal-500 focus-within:shadow-teal-100/50 focus-within:shadow-xl transition-all duration-300">
            <Search className="absolute left-5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search surgeries, e.g. LASIK, Knee Replacement, Hernia..."
              className="w-full pl-14 pr-4 py-4 md:py-5 text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none rounded-2xl font-medium"
            />
            <button
              type="submit"
              className="mr-2 flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <span className="text-xs text-slate-400 font-medium mt-1.5">Popular:</span>
          {popularSearches.map((s) => (
            <Link
              key={s}
              href={`/${lang}/surgeries?q=${encodeURIComponent(s)}`}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-600 hover:text-teal-700 text-xs font-semibold rounded-full transition-all"
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Quick Service Cards — MediBuddy style */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-10">
          {quickServices.map((s) => (
            <Link
              key={s.label}
              href={`/${lang}${s.href}`}
              className={`group flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border ${s.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
            >
              <span className="text-2xl md:text-3xl leading-none group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
              <span className="text-[11px] md:text-xs font-bold text-slate-700 text-center leading-tight">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Social Proof Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 py-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['bg-teal-400', 'bg-blue-400', 'bg-pink-400', 'bg-amber-400'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{['R','S','P','A'][i]}</div>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700">10,000+ Happy Patients</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-sm font-semibold text-slate-700">4.9/5 Average Rating</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <p className="text-sm font-semibold text-slate-700">500+ NABH-Accredited Hospitals</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200" />
          <a href="tel:9307861041" className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors">
            <Phone className="w-4 h-4 text-teal-600" />
            <p className="text-sm font-bold text-teal-700">93078-61041</p>
          </a>
        </div>
      </div>
    </section>
  );
}
