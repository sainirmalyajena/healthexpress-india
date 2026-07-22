import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import {
  Clock, Building2, HeartPulse, IndianRupee, ShieldCheck,
  CheckCircle2, AlertTriangle, ChevronDown, Phone, ArrowRight,
  Star, Stethoscope, CalendarCheck, Lock, Flame, Award, HeartHandshake, UserPlus, FileText, MapPin
} from 'lucide-react';
import { getCategoryLabel, getCategoryIcon, formatCurrency } from '@/lib/utils';
import { LeadForm } from '@/components/forms';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import {
  generateMedicalProcedureSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export const revalidate = 600; // ISR: revalidate every 10 minutes

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

const CITY_COST_FACTORS: Record<string, number> = {
  Mumbai: 1.25, Delhi: 1.20, Bangalore: 1.15, Chennai: 1.10,
  Hyderabad: 1.05, Pune: 1.10, Kolkata: 1.00, Ahmedabad: 0.95,
  Jaipur: 0.90, Lucknow: 0.88,
};

const getCategoryImage = (category: string) => {
  const map: Record<string, string> = {
    OPHTHALMOLOGY: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop',
    CARDIAC: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2000&auto=format&fit=crop',
    ORTHOPEDICS: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=80&w=2000&auto=format&fit=crop',
    NEURO: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2000&auto=format&fit=crop',
    ONCOLOGY: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2000&auto=format&fit=crop',
    GENERAL_SURGERY: 'https://images.unsplash.com/photo-1551076805-e166946e0e11?q=80&w=2000&auto=format&fit=crop',
  };
  return map[category] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop';
};

const getSurgery = cache(async (slug: string) => {
  try {
    return await prisma.surgery.findUnique({
      where: { slug },
      include: { doctors: { include: { hospital: true } } },
    });
  } catch (error) {
    console.warn(`[getSurgery] Failed for slug ${slug}:`, error);
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const surgery = await getSurgery(slug);
  if (!surgery) return { title: 'Surgery Not Found' };
  const minCost = formatCurrency(surgery.costRangeMin);
  const maxCost = formatCurrency(surgery.costRangeMax);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
  const canonical = `${baseUrl}/${lang}/surgeries/${slug}`;

  return {
    title: `${surgery.name} Cost in India – ${minCost} to ${maxCost} | HealthExpress`,
    description: `${surgery.name} surgery cost in India ranges from ${minCost} to ${maxCost}. ${surgery.overview.substring(0, 120)}`,
    alternates: {
      canonical: canonical,
      languages: {
        'en-IN': `${baseUrl}/en/surgeries/${slug}`,
        'hi-IN': `${baseUrl}/hi/surgeries/${slug}`,
      },
    },
    openGraph: {
      title: `${surgery.name} – HealthExpress India`,
      description: surgery.overview.substring(0, 160),
      url: canonical,
      type: 'article',
      locale: lang === 'hi' ? 'hi_IN' : 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${surgery.name} – HealthExpress India`,
      description: surgery.overview.substring(0, 160),
    },
    keywords: [
      surgery.name,
      `${surgery.name} cost India`,
      `${surgery.name} cost`,
      `${surgery.name} surgery price`,
      `best hospital for ${surgery.name}`,
      `${surgery.name} recovery time`,
      'affordable surgery India',
      'medical tourism India',
      ...surgery.availableCities.map(c => `${surgery.name} ${c}`),
    ],
  };
}

export async function generateStaticParams() {
  try {
    const surgeries = await prisma.surgery.findMany({ select: { slug: true }, take: 100 });
    return surgeries.flatMap(s => ['en', 'hi'].map(lang => ({ slug: s.slug, lang })));
  } catch (error) {
    console.warn('Failed to fetch surgeries for static params, falling back to dynamic generation:', error);
    return [];
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({
  icon: Icon, label, value, highlight,
}: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 p-4 rounded-xl ${highlight ? 'bg-teal-600 text-white' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${highlight ? 'text-teal-100' : 'text-slate-500'}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className={`text-lg font-bold leading-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  icon: Icon, title, iconBg = 'bg-teal-100', iconColor = 'text-teal-600',
}: { icon: React.ElementType; title: string; iconBg?: string; iconColor?: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-5">
      <span className={`w-9 h-9 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-[18px] h-[18px]" />
      </span>
      {title}
    </h2>
  );
}

function CityPricingTable({ cities, costMin, costMax, slug, lang }: { cities: string[]; costMin: number; costMax: number; slug: string; lang: string }) {
  const rows = cities
    .filter(c => CITY_COST_FACTORS[c])
    .map(c => ({
      city: c,
      min: Math.round((costMin * CITY_COST_FACTORS[c]) / 1000) * 1000,
      max: Math.round((costMax * CITY_COST_FACTORS[c]) / 1000) * 1000,
    }))
    .sort((a, b) => a.min - b.min);

  if (rows.length === 0) return null;

  return (
    <div className="mt-5 rounded-xl overflow-hidden border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-semibold text-slate-700">City</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-700">Min Cost</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-700">Max Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.city} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-3 text-slate-700">
                <Link href={`/${lang}/${row.city.toLowerCase()}/${slug}`} className="flex items-center gap-2 hover:text-teal-600 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span className="font-medium underline decoration-teal-200 underline-offset-4 hover:decoration-teal-500">{row.city}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(row.min)}</td>
              <td className="px-4 py-3 text-right font-semibold text-teal-700">{formatCurrency(row.max)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-slate-200 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 bg-white hover:bg-slate-50 transition-colors list-none">
        <span className="font-medium text-slate-900 text-sm leading-snug">{question}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
      </summary>
      <div className="px-5 py-4 bg-slate-50 text-sm text-slate-600 leading-relaxed border-t border-slate-200">
        {answer}
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SurgeryDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const surgery = await getSurgery(slug);
  if (!surgery) notFound();

  const dictionary = await getDictionary(lang as Locale);
  const dict = dictionary.detail_page;
  const faqs = surgery.faqs as { question: string; answer: string }[];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
  const categoryLabel = getCategoryLabel(surgery.category, dictionary.categories);
  const doctor = surgery.doctors?.[0];

  const medicalSchema = generateMedicalProcedureSchema({
    name: surgery.name,
    description: surgery.overview,
    category: categoryLabel,
    costMin: surgery.costRangeMin,
    costMax: surgery.costRangeMax,
    duration: surgery.duration,
    hospitalStay: surgery.hospitalStay,
    recovery: surgery.recovery,
    risks: surgery.risks,
    preparation: surgery.preparation,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.home,      url: `${baseUrl}/${lang}` },
    { name: dict.surgeries, url: `${baseUrl}/${lang}/surgeries` },
    { name: categoryLabel,  url: `${baseUrl}/${lang}/surgeries?category=${surgery.category}` },
    { name: surgery.name,   url: `${baseUrl}/${lang}/surgeries/${surgery.slug}` },
  ]);
  const faqSchema = faqs?.length ? generateFAQSchema(faqs) : null;

  const whatsappMsg = encodeURIComponent(
    `Hi HealthExpress, I need information about ${surgery.name}. Please guide me.`
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href={`/${lang}`} className="hover:text-teal-600 transition-colors">{dict.home}</Link>
            <span className="text-slate-300">/</span>
            <Link href={`/${lang}/surgeries`} className="hover:text-teal-600 transition-colors">{dict.surgeries}</Link>
            <span className="text-slate-300">/</span>
            <Link href={`/${lang}/surgeries?category=${surgery.category}`} className="hover:text-teal-600 transition-colors">{categoryLabel}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{surgery.name}</span>
          </nav>
        </div>
      </div>

      {/* Page Hero - Stunning Visual Banner */}
      <div className="relative bg-slate-900 border-b border-teal-900/50 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getCategoryImage(surgery.category)} 
            alt={`${surgery.name} in India`}
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent md:w-3/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-2xl drop-shadow-md" aria-hidden="true">{getCategoryIcon(surgery.category)}</span>
              <span className="text-xs font-bold text-teal-300 bg-teal-900/50 border border-teal-400/30 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                {categoryLabel}
              </span>
              {surgery.insuranceLikely && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-400/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> {dict.insurance_likely}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight drop-shadow-lg">
              {surgery.name}
            </h1>
            
            {doctor && (
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 bg-slate-800/50 border border-slate-600/50 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
                <span className="text-sm">⚕️</span>
                <span className="font-medium">{lang === 'hi' ? 'चिकित्सा विशेषज्ञ द्वारा समीक्षित: ' : 'Medically Reviewed by '}</span>
                <Link href={`/${lang}/doctors/${doctor.id}`} className="font-bold text-teal-400 hover:text-teal-300 transition-colors underline decoration-teal-400/30 underline-offset-2">
                  Dr. {doctor.name}
                </Link>
              </div>
            )}
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-medium drop-shadow-md">
              {surgery.overview.split('.')[0]}.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatPill icon={Clock}       label={dict.duration}      value={surgery.duration}                            />
              <StatPill icon={Building2}   label={dict.hospital_stay} value={surgery.hospitalStay}                        />
              <StatPill icon={HeartPulse}  label={dict.recovery}      value={surgery.recovery.split('.')[0]}              />
              <StatPill icon={IndianRupee} label={dict.est_cost}       value={`${formatCurrency(surgery.costRangeMin)}+`}  highlight />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            <section className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-7 shadow-premium border border-teal-800/20">
              <h2 className="flex items-center gap-3 text-lg font-bold text-teal-400 mb-4">
                <span className="w-8 h-8 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                {lang === 'hi' ? 'त्वरित तथ्य और मुख्य बातें' : 'Quick Facts & Key Takeaways'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-200">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'अनुमानित लागत:' : 'Estimated Cost:'}</strong> {formatCurrency(surgery.costRangeMin)} - {formatCurrency(surgery.costRangeMax)}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'रिकवरी अवधि:' : 'Recovery Period:'}</strong> {surgery.recovery.split('.')[0]}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'अस्पताल में ठहराव:' : 'Hospital Stay:'}</strong> {surgery.hospitalStay}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'सामान्य लक्षण:' : 'Typical Symptoms:'}</strong> {surgery.symptoms.slice(0, 3).join(', ') || (lang === 'hi' ? 'मामले के अनुसार अलग' : 'Varies by case')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'बीमा कवरेज:' : 'Insurance Coverage:'}</strong> {surgery.insuranceLikely ? (lang === 'hi' ? 'आमतौर पर कवर किया जाता है' : 'Usually covered') : (lang === 'hi' ? 'पॉलिसी जांच के अधीन' : 'Subject to policy check')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <p><strong className="text-white">{lang === 'hi' ? 'मान्यता:' : 'Accreditation:'}</strong> {lang === 'hi' ? 'JCI/NABH मानकों द्वारा सत्यापित' : 'Verified by JCI/NABH Standards'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={Stethoscope} title={dict.overview} />
              <p className="text-slate-700 leading-relaxed">{surgery.overview}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={IndianRupee} title={dict.cost_insurance} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
              
              <div className="flex flex-col md:flex-row gap-5 mb-8">
                <div className="flex-1 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <IndianRupee className="w-24 h-24" />
                  </div>
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">Transparent Pricing</p>
                  <h3 className="text-xl font-bold mb-1">Starting from {formatCurrency(surgery.costRangeMin)}</h3>
                  <p className="text-slate-300 text-sm mb-6">No hidden charges. 100% transparency.</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>Surgeon & Anesthesia Fees</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>OT & Consumables</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>Pre-op & Post-op Consultations</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-900">Insurance Eligibility Check</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Are you covered for {surgery.name}? Our insurance desk handles approvals within 30 minutes. 
                      {surgery.insuranceLikely ? ' This procedure is usually covered by major policies.' : ''}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-sm text-slate-700 font-medium">100% Cashless Available</span>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-sm text-slate-700 font-medium">Zero Cost EMI Options</span>
                    </div>
                  </div>
                  <a href="#lead-form" className="block w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm text-center rounded-lg transition-colors border border-blue-200">
                    Check My Insurance
                  </a>
                </div>
              </div>

              {surgery.availableCities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-1 text-sm">Cost by City</h3>
                  <p className="text-xs text-slate-500 mb-4">Estimated ranges — actual costs depend on hospital tier and case complexity.</p>
                  <CityPricingTable cities={surgery.availableCities} costMin={surgery.costRangeMin} costMax={surgery.costRangeMax} slug={surgery.slug} lang={lang} />
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={Award} title="Why Choose HealthExpress India?" iconBg="bg-amber-100" iconColor="text-amber-600" />
              
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Access to Experienced {categoryLabel} Specialists</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">We partner exclusively with top-tier hospitals providing access to board-certified specialists with 10+ years of proven expertise in {categoryLabel}.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">NABH & JCI Hospitals</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Your safety is our priority. We only work with strictly audited, accredited premium hospitals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Hassle-Free Insurance</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Our dedicated desk handles all paperwork, ensuring smooth 100% cashless claims.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">End-to-End Care</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Free cabs on the day of surgery, admission assistance, and post-op recovery tracking.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl shadow-sm border border-teal-100 p-7 overflow-hidden relative">
              <div className="absolute right-0 bottom-0 opacity-5">
                <UserPlus className="w-64 h-64 -mb-10 -mr-10" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-teal-200 rounded-full text-xs font-bold text-teal-700 uppercase tracking-wide mb-4">
                    <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" /> Premium Service
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Dedicated Care Coordinator</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Surgery can be stressful. We assign a personal care buddy to you from day one. They handle your appointments, insurance paperwork, hospital admission, and even arrange your free cab on the day of surgery.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-800"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 24/7 WhatsApp Support</li>
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-800"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Priority Doctor Appointments</li>
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-800"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Zero Wait-time on Admission</li>
                  </ul>
                  <a href="#lead-form" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-teal-200">
                    Book Your FREE {surgery.name} Consultation <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={AlertTriangle} title={dict.when_needed} iconBg="bg-amber-100" iconColor="text-amber-600" />
              <p className="text-slate-700 leading-relaxed mb-5">{surgery.indications}</p>
              {surgery.symptoms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">{dict.common_symptoms}</p>
                  <div className="flex flex-wrap gap-2">
                    {surgery.symptoms.map(s => (
                      <span key={s} className="text-sm bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {surgery.doctors?.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                <SectionHeading icon={Star} title={`${dict.top_surgeons} ${surgery.name}`} />
                <div className="grid md:grid-cols-2 gap-5">
                  {surgery.doctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} lang={lang} dict={dictionary.doctor_card} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href={`/${lang}/doctors`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                    {dict.view_all_doctors} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={Flame} title={dict.procedure_summary} iconBg="bg-blue-100" iconColor="text-blue-600" />
              <p className="text-slate-700 leading-relaxed">{surgery.procedure}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={CheckCircle2} title={dict.prep_checklist} iconBg="bg-purple-100" iconColor="text-purple-600" />
              <p className="text-slate-700 leading-relaxed">{surgery.preparation}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={HeartPulse} title={dict.recovery_post_op} iconBg="bg-green-100" iconColor="text-green-600" />
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">{dict.recovery_timeline}</h3>
                  <p className="text-slate-700 leading-relaxed">{surgery.recovery}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">{dict.post_op_tips}</h3>
                  <p className="text-slate-700 leading-relaxed">{surgery.postOpCare}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={AlertTriangle} title={dict.risks_complications} iconBg="bg-red-100" iconColor="text-red-500" />
              <p className="text-slate-700 leading-relaxed mb-4">{surgery.risks}</p>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700"><strong>{dict.note}:</strong> {dict.risk_disclaimer}</p>
              </div>
            </section>

            {surgery.slug === 'lasik-eye-surgery' && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                <SectionHeading icon={Award} title="Compare Vision Correction Options" iconBg="bg-indigo-100" iconColor="text-indigo-600" />
                <div className="overflow-x-auto mt-4 rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Procedure</th>
                        <th className="px-4 py-3">Recovery Time</th>
                        <th className="px-4 py-3">Typical Cost Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-teal-700">LASIK</td>
                        <td className="px-4 py-3">1–2 days</td>
                        <td className="px-4 py-3 font-medium text-slate-900">₹40,000 – ₹1,00,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-teal-700">SMILE</td>
                        <td className="px-4 py-3">2–3 days</td>
                        <td className="px-4 py-3 font-medium text-slate-900">₹80,000 – ₹1,50,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-teal-700">PRK</td>
                        <td className="px-4 py-3">3–7 days</td>
                        <td className="px-4 py-3 font-medium text-slate-900">₹35,000 – ₹80,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {faqs?.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                <SectionHeading icon={CheckCircle2} title={dict.faqs} iconBg="bg-indigo-100" iconColor="text-indigo-600" />
                <div className="space-y-3">
                  {faqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0" id="lead-form">
            <div className="sticky top-24 space-y-5">

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs font-semibold text-green-700">Experts Available Now</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{dict.get_in_touch}</h2>
                <p className="text-sm text-slate-500 mb-4">{dict.form_subtitle}</p>
                <LeadForm surgeryId={surgery.id} surgeryName={surgery.name} />
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-500">
                    {dict.data_safe}{' '}
                    <Link href={`/${lang}/privacy`} className="underline hover:text-teal-600">{dict.privacy_policy}</Link>
                  </p>
                </div>
              </div>

              <div className="bg-teal-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-xs mb-4 text-teal-100 uppercase tracking-wider">{dict.what_happens_next}</h3>
                <div className="space-y-4">
                  {([
                    { icon: Phone,         title: dict.step1_title, desc: dict.step1_desc },
                    { icon: CalendarCheck, title: dict.step2_title, desc: dict.step2_desc },
                    { icon: Building2,     title: dict.step3_title, desc: dict.step3_desc },
                  ] as const).map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-500/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                        <p className="text-xs text-teal-200">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/919307861041?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
                  <path d="M12.0117 2C6.50574 2 2.02344 6.47837 2.02344 11.9841C2.02344 13.7485 2.48297 15.4678 3.37032 17.009L2 22L7.12596 20.6559C8.61867 21.4672 10.3061 21.8973 12.0117 21.8973H12.0159C17.5218 21.8973 22.0041 17.4189 22.0041 11.913C22.0041 9.25621 20.9723 6.7728 19.0988 4.8993C17.2253 3.0258 14.7171 2 12.0117 2ZM17.4299 14.8804C17.1329 14.7317 15.672 14.0135 15.3995 13.9142C15.127 13.815 14.9288 13.8646 14.7306 14.1624C14.5323 14.4594 13.9623 15.1287 13.7889 15.327C13.6154 15.5252 13.4419 15.55 13.1448 15.4013C12.8478 15.2524 11.8896 14.9388 10.7516 13.9242C9.86422 13.1325 9.26514 12.155 8.96807 11.6591C8.671 11.1632 8.93661 10.8878 9.08518 10.74C9.21855 10.6074 9.38202 10.3941 9.53059 10.2206C9.67917 10.0471 9.72877 9.92316 9.82796 9.72477C9.92715 9.52638 9.87755 9.35286 9.80315 9.20405C9.72875 9.05525 9.13426 7.59247 8.88636 6.9967C8.63845 6.42555 8.39055 6.50058 8.19236 6.50058C7.82065 6.47513 7.62247 6.47513C7.10234 6.54955 6.82998 6.84662C6.55747 7.1437 5.78913 7.86221 5.78913 9.32788C5.78913 10.7925 6.85478 12.204 7.00335 12.4023C7.15191 12.6005 9.08331 15.5752 12.0315 16.848C12.7335 17.1517 13.2801 17.3331 13.7088 17.4691C14.5422 17.7336 15.2973 17.6957 15.8926 17.6067C16.5529 17.5079 17.9252 16.7753 18.2223 15.9324C18.5193 15.0895 18.5193 14.3713 18.4449 14.2474C18.3705 14.1235 18.1724 14.0535 17.8753 13.9048L17.4299 14.8804Z" />
                </svg>
                Chat on WhatsApp
              </a>

              <a
                href="tel:+919307861041"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-700 font-semibold text-sm rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" /> Call 93078-61041
              </a>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-slate-100 border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-600">⚕️ Medical Disclaimer:</strong>{' '}
            {dictionary.footer.disclaimer.includes(':')
              ? dictionary.footer.disclaimer.split(':').slice(1).join(':').trim()
              : dictionary.footer.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
