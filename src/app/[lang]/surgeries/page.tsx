import Link from 'next/link';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import {
  Search, SlidersHorizontal, MapPin, ShieldCheck,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Clock, Building2, IndianRupee, ChevronRight, Sparkles,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getCategoryLabel, getCategoryIcon, formatCurrency } from '@/lib/utils';
import { Category, Prisma } from '@/generated/prisma';
import { SurgeryCardSkeleton } from '@/components/ui';
import { expandQuery } from '@/lib/search-utils';
import { generateCollectionPageSchema } from '@/lib/schema';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAISuggestedTerms, isLikelySymptomatic } from '@/lib/ai-search';

interface SearchParams {
  q?: string;
  category?: string;
  insurance?: string;
  city?: string;
  page?: string;
  sort?: 'cost-asc' | 'cost-desc' | 'name-asc';
}

const ITEMS_PER_PAGE = 12;

// ─── Data ────────────────────────────────────────────────────────────────────

async function getSurgeries(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const sort = searchParams.sort || 'name-asc';

  const where: Prisma.SurgeryWhereInput = {};
  if (searchParams.category) where.category = searchParams.category as Category;
  if (searchParams.insurance === 'yes') where.insuranceLikely = true;
  else if (searchParams.insurance === 'no') where.insuranceLikely = false;
  if (searchParams.city) where.availableCities = { has: searchParams.city };

  const allForCities = await prisma.surgery.findMany({ select: { availableCities: true } });
  const uniqueCities = Array.from(new Set(allForCities.flatMap(s => s.availableCities))).sort();

  let orderBy: Prisma.SurgeryOrderByWithRelationInput = { name: 'asc' };
  if (sort === 'cost-asc') orderBy = { costRangeMin: 'asc' };
  if (sort === 'cost-desc') orderBy = { costRangeMin: 'desc' };

  if (searchParams.q) {
    let queryTerms = expandQuery(searchParams.q);
    const searchQuery = searchParams.q.toLowerCase();
    let isAIInterpreted = false;

    if (isLikelySymptomatic(searchParams.q)) {
      const aiTerms = await getAISuggestedTerms(searchParams.q);
      if (aiTerms.length > 0) {
        queryTerms = [...new Set([...queryTerms, ...aiTerms])];
        isAIInterpreted = true;
      }
    }

    const allCandidates = await prisma.surgery.findMany({ where, orderBy });
    const scored = allCandidates.map(s => {
      let score = 0;
      const name = s.name.toLowerCase();
      const category = s.category.toLowerCase();
      const overview = s.overview.toLowerCase();
      const symptoms = s.symptoms.map(sym => sym.toLowerCase());
      if (name.includes(searchQuery)) score += 100;
      if (category.includes(searchQuery)) score += 80;
      queryTerms.forEach(term => {
        if (name.includes(term)) score += 50;
        if (category.includes(term)) score += 30;
        if (symptoms.some(sym => sym.includes(term))) score += 20;
        if (overview.includes(term)) score += 10;
      });
      return { surgery: s, score };
    });
    const filtered = scored.filter(i => i.score > 0).sort((a, b) => b.score - a.score).map(i => i.surgery);
    const total = filtered.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
    const surgeries = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    return { surgeries, total, page, totalPages, uniqueCities, isAIInterpreted };
  }

  const [surgeries, total] = await Promise.all([
    prisma.surgery.findMany({ where, skip, take: ITEMS_PER_PAGE, orderBy }),
    prisma.surgery.count({ where }),
  ]);
  return { surgeries, total, page, totalPages: Math.ceil(total / ITEMS_PER_PAGE) || 1, uniqueCities, isAIInterpreted: false };
}

// ─── Surgery Card ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SurgeryCard({ surgery, lang, dict }: { surgery: any; lang: string; dict: any }) {
  return (
    <Link
      href={`/${lang}/surgeries/${surgery.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
            <span className="text-base leading-none">{getCategoryIcon(surgery.category)}</span>
            {getCategoryLabel(surgery.category, dict.categories)}
          </span>
          {surgery.insuranceLikely && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              {dict.usually_covered}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-1.5 leading-snug">
          {surgery.name}
        </h3>

        {/* Overview */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {surgery.overview}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {surgery.duration}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {surgery.hospitalStay}
          </span>
        </div>

        {/* Symptoms */}
        {surgery.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {surgery.symptoms.slice(0, 3).map((s: string) => (
              <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{s}</span>
            ))}
            {surgery.symptoms.length > 3 && (
              <span className="text-xs text-slate-400">+{surgery.symptoms.length - 3}</span>
            )}
          </div>
        )}

        {/* Cost footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{dict.estimated_cost}</p>
            <p className="text-sm font-bold text-slate-900">
              {formatCurrency(surgery.costRangeMin)}
              <span className="text-slate-400 font-normal"> – </span>
              {formatCurrency(surgery.costRangeMax)}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Pagination({ page, totalPages, searchParams, lang, dict }: any) {
  const mkUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.insurance) params.set('insurance', searchParams.insurance);
    if (searchParams.city) params.set('city', searchParams.city);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    params.set('page', p.toString());
    return `/${lang}/surgeries?${params.toString()}`;
  };

  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {page > 1 && (
        <Link href={mkUrl(page - 1)} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:text-teal-700 transition-colors shadow-sm">
          ← {dict.previous}
        </Link>
      )}
      <span className="px-4 py-2.5 text-sm text-slate-500 bg-white rounded-xl border border-slate-100">
        {dict.page} {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link href={mkUrl(page + 1)} className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
          {dict.next} →
        </Link>
      )}
    </div>
  );
}

// ─── Surgery List (async, wrapped in Suspense) ────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function SurgeryList({ searchParams, lang, dict }: { searchParams: SearchParams; lang: string; dict: any }) {
  const { surgeries, total, page, totalPages, isAIInterpreted } = await getSurgeries(searchParams);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-600">
          Showing <strong>{surgeries.length}</strong> of <strong>{total}</strong> surgeries
        </p>
        {isAIInterpreted && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100 shadow-sm">
            <Sparkles className="w-3 h-3" />
            AI Interpreted
          </div>
        )}
      </div>

      {surgeries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{dict.no_surgeries_found}</h3>
          <p className="text-slate-500 mb-6">{dict.try_adjusting}</p>
          <Link href={`/${lang}/surgeries`} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-teal-600 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
            {dict.clear_filters}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {surgeries.map((surgery) => (
            <SurgeryCard key={surgery.id} surgery={surgery} lang={lang} dict={dict} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} searchParams={searchParams} lang={lang} dict={dict} />
    </>
  );
}

function LoadingGrid() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => <SurgeryCardSkeleton key={i} />)}
    </div>
  );
}

// ─── Category Quick Filter ────────────────────────────────────────────────────

function CategoryPills({ lang, activeCategory }: { lang: string; activeCategory?: string }) {
  const categories = Object.values(Category);
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href={`/${lang}/surgeries`}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
          !activeCategory
            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'
        }`}
      >
        All
      </Link>
      {categories.map(cat => (
        <Link
          key={cat}
          href={`/${lang}/surgeries?category=${cat}`}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            activeCategory === cat
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'
          }`}
        >
          <span className="text-base leading-none">{getCategoryIcon(cat)}</span>
          {cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </Link>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'hi' ? 'सर्जरी निर्देशिका – HealthExpress India' : 'Surgery Directory – HealthExpress India',
    description: lang === 'hi'
      ? 'भारत भर में 100+ सर्जरी प्रक्रियाओं की विस्तृत जानकारी। लागत, रिकवरी, और शीर्ष अस्पताल।'
      : 'Find detailed information on 100+ surgical procedures across India — costs, recovery timelines, and top hospitals.',
  };
}

export default async function SurgeriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const dictionary = await getDictionary(lang as Locale);
  const dict = { ...dictionary.surgeries, categories: dictionary.categories };

  const allForCities = await prisma.surgery.findMany({ select: { availableCities: true } });
  const uniqueCities = Array.from(new Set(allForCities.flatMap(s => s.availableCities))).sort();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
  const collectionSchema = generateCollectionPageSchema(
    'Surgery Directory – HealthExpress India',
    'Find detailed information on surgical procedures across India — costs, recovery timelines, and top hospitals.',
    `${baseUrl}/surgeries`
  );

  const mkFilterUrl = (key: string, val: string) => {
    const params = new URLSearchParams();
    if (sp.q) params.set('q', sp.q);
    if (sp.sort) params.set('sort', sp.sort);
    if (key !== 'category' && sp.category) params.set('category', sp.category);
    if (key !== 'insurance' && sp.insurance) params.set('insurance', sp.insurance);
    if (key !== 'city' && sp.city) params.set('city', sp.city);
    if (val) params.set(key, val);
    return `/${lang}/surgeries?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            {dict.directory_title}
          </h1>
          <p className="text-slate-500 mb-7">{dict.directory_subtitle}</p>

          {/* Search bar */}
          <form action={`/${lang}/surgeries`} method="GET" className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={sp.q}
                placeholder={dict.search_placeholder}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white shadow-sm"
              />
              {sp.category && <input type="hidden" name="category" value={sp.category} />}
              {sp.insurance && <input type="hidden" name="insurance" value={sp.insurance} />}
              {sp.city && <input type="hidden" name="city" value={sp.city} />}
            </div>
            <button type="submit" className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
              Search
            </button>
          </form>
        </div>

        {/* Category scroll bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
          <CategoryPills lang={lang} activeCategory={sp.category} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active city alert */}
        {sp.city && (
          <div className="mb-6 flex items-center justify-between gap-4 p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-teal-900">
                Showing surgeries available in <span className="underline">{sp.city}</span>
              </p>
            </div>
            <Link href={mkFilterUrl('city', '')} className="text-xs font-semibold text-teal-600 hover:text-teal-800 whitespace-nowrap">
              Clear ✕
            </Link>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24 space-y-7">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                {dict.filters}
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{dict.sort_by}</p>
                <div className="space-y-1">
                  {[
                    { value: 'name-asc', label: dict.sort_name },
                    { value: 'cost-asc', label: dict.sort_cost_low },
                    { value: 'cost-desc', label: dict.sort_cost_high },
                  ].map(opt => (
                    <Link
                      key={opt.value}
                      href={mkFilterUrl('sort', opt.value)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        (sp.sort || 'name-asc') === opt.value
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {(sp.sort || 'name-asc') === opt.value && (
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                      )}
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{dict.city}</p>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <Link
                    href={mkFilterUrl('city', '')}
                    className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      !sp.city ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Cities
                  </Link>
                  {uniqueCities.map(city => (
                    <Link
                      key={city}
                      href={mkFilterUrl('city', city)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        sp.city === city ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sp.city === city && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />}
                      {city}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{dict.insurance_coverage}</p>
                <div className="space-y-1">
                  {[
                    { value: '', label: dict.all },
                    { value: 'yes', label: dict.usually_covered },
                    { value: 'no', label: dict.usually_not_covered },
                  ].map(opt => (
                    <Link
                      key={opt.value}
                      href={mkFilterUrl('insurance', opt.value)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        (sp.insurance || '') === opt.value
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {(sp.insurance || '') === opt.value && (
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                      )}
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-teal-600 rounded-xl p-4 text-white text-center">
                <p className="text-xs font-semibold text-teal-100 mb-2">Need guidance?</p>
                <a href="tel:9307861041" className="flex items-center justify-center gap-2 text-sm font-bold">
                  📞 93078-61041
                </a>
              </div>
            </div>
          </aside>

          {/* ── Main Grid ── */}
          <main className="lg:col-span-3">
            <Suspense fallback={<LoadingGrid />}>
              <SurgeryList searchParams={sp} lang={lang} dict={dict} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
