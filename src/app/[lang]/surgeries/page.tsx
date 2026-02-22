import Link from 'next/link';
import { Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCategoryLabel, getCategoryIcon, formatCurrency } from '@/lib/utils';
import { Category, Prisma } from '@/generated/prisma';
import { SurgeryCardSkeleton } from '@/components/ui';
import { expandQuery } from '@/lib/search-utils';
import { generateCollectionPageSchema } from '@/lib/schema';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

interface SearchParams {
    q?: string;
    category?: string;
    insurance?: string;
    city?: string;
    page?: string;
    sort?: 'cost-asc' | 'cost-desc' | 'name-asc';
}

const ITEMS_PER_PAGE = 12;

async function getSurgeries(searchParams: SearchParams) {
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const sort = searchParams.sort || 'name-asc';

    // Base filters
    const where: Prisma.SurgeryWhereInput = {};

    if (searchParams.category) {
        where.category = searchParams.category as Category;
    }

    if (searchParams.insurance === 'yes') {
        where.insuranceLikely = true;
    } else if (searchParams.insurance === 'no') {
        where.insuranceLikely = false;
    }

    if (searchParams.city) {
        where.availableCities = {
            has: searchParams.city
        };
    }

    // Get unique cities for filter dropdown
    const allSurgeriesForCities = await prisma.surgery.findMany({
        select: { availableCities: true }
    });
    const uniqueCities = Array.from(new Set(allSurgeriesForCities.flatMap(s => s.availableCities))).sort();

    // Sorting definition
    let orderBy: Prisma.SurgeryOrderByWithRelationInput = { name: 'asc' };
    if (sort === 'cost-asc') orderBy = { costRangeMin: 'asc' };
    if (sort === 'cost-desc') orderBy = { costRangeMin: 'desc' };

    // If search query 'q' exists, we fetch matching candidates and filter in-memory with relevance scoring
    if (searchParams.q) {
        const queryTerms = expandQuery(searchParams.q);
        const searchQuery = searchParams.q.toLowerCase();

        const allCandidates = await prisma.surgery.findMany({
            where,
            orderBy // Use as fallback sort
        });

        const scored = allCandidates.map(s => {
            let score = 0;
            const name = s.name.toLowerCase();
            const category = s.category.toLowerCase();
            const overview = s.overview.toLowerCase();
            const symptoms = s.symptoms.map(sym => sym.toLowerCase());

            // Primary match (exact string in name)
            if (name.includes(searchQuery)) score += 100;
            if (category.includes(searchQuery)) score += 80;

            // Term-based matching
            queryTerms.forEach(term => {
                if (name.includes(term)) score += 50;
                if (category.includes(term)) score += 30;
                if (symptoms.some(sym => sym.includes(term))) score += 20;
                if (overview.includes(term)) score += 10;
            });

            return { surgery: s, score };
        });

        // Filter out zero matches and sort by score
        const filtered = scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.surgery);

        const total = filtered.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const surgeries = filtered.slice(start, end);

        return { surgeries, total, page, totalPages, uniqueCities };
    }

    const [surgeries, total] = await Promise.all([
        prisma.surgery.findMany({
            where,
            skip,
            take: ITEMS_PER_PAGE,
            orderBy
        }),
        prisma.surgery.count({ where })
    ]);

    return {
        surgeries,
        total,
        page,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE) || 1,
        uniqueCities
    };
}

function SurgeryCard({ surgery, lang, dict }: { surgery: any; lang: string; dict: any }) {
    return (
        <Link
            href={`/${lang}/surgeries/${surgery.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(surgery.category)}</span>
                        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                            {getCategoryLabel(surgery.category, dict.categories)}
                        </span>
                    </div>
                    {surgery.insuranceLikely && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {dict.usually_covered}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
                    {surgery.name}
                </h3>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {surgery.overview}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {surgery.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {surgery.hospitalStay}
                    </span>
                </div>

                {surgery.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {surgery.symptoms.slice(0, 3).map((symptom: string) => (
                            <span key={symptom} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {symptom}
                            </span>
                        ))}
                        {surgery.symptoms.length > 3 && (
                            <span className="text-xs text-slate-400">+{surgery.symptoms.length - 3} {lang === 'hi' ? 'और' : 'more'}</span>
                        )}
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{dict.estimated_cost}</span>
                        <span className="text-sm font-semibold text-slate-900">
                            {formatCurrency(surgery.costRangeMin)} - {formatCurrency(surgery.costRangeMax)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function Pagination({ page, totalPages, searchParams, lang, dict }: { page: number; totalPages: number; searchParams: SearchParams; lang: string; dict: any }) {
    const createPageUrl = (pageNum: number) => {
        const params = new URLSearchParams();
        if (searchParams.q) params.set('q', searchParams.q);
        if (searchParams.category) params.set('category', searchParams.category);
        if (searchParams.insurance) params.set('insurance', searchParams.insurance);
        if (searchParams.city) params.set('city', searchParams.city);
        if (searchParams.sort) params.set('sort', searchParams.sort);
        params.set('page', pageNum.toString());
        return `/${lang}/surgeries?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
                <Link
                    href={createPageUrl(page - 1)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    {dict.previous}
                </Link>
            )}

            <span className="px-4 py-2 text-sm text-slate-600">
                {dict.page} {page} {lang === 'hi' ? 'कुल' : 'of'} {totalPages}
            </span>

            {page < totalPages && (
                <Link
                    href={createPageUrl(page + 1)}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                >
                    {dict.next}
                </Link>
            )}
        </div>
    );
}

async function SurgeryList({ searchParams, lang, dict }: { searchParams: SearchParams; lang: string; dict: any }) {
    const { surgeries, total, page, totalPages } = await getSurgeries(searchParams);

    if (surgeries.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{dict.no_surgeries_found}</h3>
                <p className="text-slate-600 mb-6">{dict.try_adjusting}</p>
                <Link
                    href={`/${lang}/surgeries`}
                    className="inline-flex px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                >
                    {dict.clear_filters}
                </Link>
            </div>
        );
    }

    return (
        <>
            <p className="text-sm text-slate-600 mb-6">
                {dict.showing} {surgeries.length} {dict.of} {total} {lang === 'hi' ? 'सर्जरी' : 'surgeries'}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {surgeries.map((surgery) => (
                    <SurgeryCard key={surgery.id} surgery={surgery} lang={lang} dict={dict} />
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} searchParams={searchParams} lang={lang} dict={dict} />
        </>
    );
}

function LoadingGrid() {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <SurgeryCardSkeleton key={i} />
            ))}
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'सर्जरी निर्देशिका' : 'Surgery Directory',
        description: lang === 'hi'
            ? 'हमारी व्यापक सर्जरी निर्देशिका ब्राउज़ करें। भारत भर में प्रक्रियाओं, लागतों और रिकवरी समय के बारे में विस्तृत जानकारी प्राप्त करें।'
            : 'Browse our comprehensive surgery directory. Find detailed information about procedures, costs, and recovery times across India.',
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
    const searchParamsObj = await searchParams;
    const dictionary = await getDictionary(lang as Locale);
    const dict = dictionary.surgeries;

    // Fetch unique cities for the sidebar
    const allSurgeriesForCities = await prisma.surgery.findMany({
        select: { availableCities: true }
    });
    const uniqueCities = Array.from(new Set(allSurgeriesForCities.flatMap(s => s.availableCities))).sort();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
    const collectionSchema = generateCollectionPageSchema(
        'Surgery Directory - HealthExpress India',
        'Browse our comprehensive surgery directory. Find detailed information about procedures, costs, and recovery times across India.',
        `${baseUrl}/surgeries`
    );

    const surgeriesDict = {
        ...dict,
        categories: dictionary.categories
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Schema.org Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{dict.directory_title}</h1>
                    <p className="text-slate-600">{dict.directory_subtitle}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Active City Filter Alert */}
                {searchParamsObj.city && (
                    <div className="mb-8 p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <h3 className="font-semibold text-teal-900">
                                    {lang === 'hi' ? `${searchParamsObj.city} में उपलब्ध सर्जरी देख रहे हैं` : `Viewing available surgeries in ${searchParamsObj.city}`}
                                </h3>
                                <p className="text-sm text-teal-700">Displaying valid surgeries for this region. Costs may vary by city.</p>
                            </div>
                        </div>
                        <Link
                            href={`/${lang}/surgeries?${searchParamsObj.q ? `q=${searchParamsObj.q}&` : ''}${searchParamsObj.category ? `category=${searchParamsObj.category}&` : ''}${searchParamsObj.insurance ? `insurance=${searchParamsObj.insurance}` : ''}`}
                            className="text-sm font-medium text-teal-700 hover:text-teal-900 whitespace-nowrap"
                        >
                            {lang === 'hi' ? 'शहर बदलें' : 'Change City'} ✕
                        </Link>
                    </div>
                )}

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 mb-8 lg:mb-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="font-semibold text-slate-900 mb-4">{dict.filters}</h2>

                            {/* Search */}
                            <form action={`/${lang}/surgeries`} method="GET" className="mb-6">
                                <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                                    {dict.search}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        name="q"
                                        defaultValue={searchParamsObj.q}
                                        placeholder={dict.search_placeholder}
                                        autoComplete="off"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm group-hover:border-teal-300"
                                    />
                                    {searchParamsObj.category && <input type="hidden" name="category" value={searchParamsObj.category} />}
                                    {searchParamsObj.insurance && <input type="hidden" name="insurance" value={searchParamsObj.insurance} />}
                                    {searchParamsObj.city && <input type="hidden" name="city" value={searchParamsObj.city} />}
                                    {searchParamsObj.sort && <input type="hidden" name="sort" value={searchParamsObj.sort} />}
                                </div>
                            </form>

                            {/* Sort Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">{dict.sort_by}</label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'name-asc', label: dict.sort_name },
                                        { value: 'cost-asc', label: dict.sort_cost_low },
                                        { value: 'cost-desc', label: dict.sort_cost_high },
                                    ].map((option) => (
                                        <Link
                                            key={option.value}
                                            href={`/${lang}/surgeries?${searchParamsObj.q ? `q=${searchParamsObj.q}&` : ''}${searchParamsObj.category ? `category=${searchParamsObj.category}&` : ''}${searchParamsObj.insurance ? `insurance=${searchParamsObj.insurance}&` : ''}${searchParamsObj.city ? `city=${searchParamsObj.city}&` : ''}sort=${option.value}`}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${(searchParamsObj.sort || 'name-asc') === option.value ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* City Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">{dict.city}</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    <Link
                                        href={`/${lang}/surgeries?${searchParamsObj.q ? `q=${searchParamsObj.q}&` : ''}${searchParamsObj.category ? `category=${searchParamsObj.category}&` : ''}${searchParamsObj.insurance ? `insurance=${searchParamsObj.insurance}&` : ''}${searchParamsObj.sort ? `sort=${searchParamsObj.sort}` : ''}`}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${!searchParamsObj.city ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {lang === 'hi' ? 'सभी शहर' : 'All Cities'}
                                    </Link>
                                    {uniqueCities.map((city) => (
                                        <Link
                                            key={city}
                                            href={`/${lang}/surgeries?city=${city}${searchParamsObj.q ? `&q=${searchParamsObj.q}` : ''}${searchParamsObj.category ? `&category=${searchParamsObj.category}` : ''}${searchParamsObj.insurance ? `&insurance=${searchParamsObj.insurance}` : ''}${searchParamsObj.sort ? `&sort=${searchParamsObj.sort}` : ''}`}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${searchParamsObj.city === city ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Insurance Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{dict.insurance_coverage}</label>
                                <div className="space-y-2">
                                    {[
                                        { value: '', label: dict.all },
                                        { value: 'yes', label: dict.usually_covered },
                                        { value: 'no', label: dict.usually_not_covered },
                                    ].map((option) => (
                                        <Link
                                            key={option.value}
                                            href={`/${lang}/surgeries?${searchParamsObj.q ? `q=${searchParamsObj.q}&` : ''}${searchParamsObj.category ? `category=${searchParamsObj.category}&` : ''}${option.value ? `insurance=${option.value}&` : ''}${searchParamsObj.city ? `city=${searchParamsObj.city}&` : ''}${searchParamsObj.sort ? `sort=${searchParamsObj.sort}` : ''}`}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${(searchParamsObj.insurance || '') === option.value ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Surgery Grid */}
                    <main className="lg:col-span-3">
                        <Suspense fallback={<LoadingGrid />}>
                            <SurgeryList searchParams={searchParamsObj} lang={lang} dict={surgeriesDict} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Surgery Directory',
    description: 'Browse our comprehensive surgery directory. Find detailed information about procedures, costs, and recovery times across India.',
};
