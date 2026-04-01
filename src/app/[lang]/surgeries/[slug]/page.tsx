import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import {
  Clock, Building2, HeartPulse, IndianRupee, ShieldCheck,
  CheckCircle2, AlertTriangle, ChevronDown, Phone, ArrowRight,
  Star, MapPin, Stethoscope, CalendarCheck, Lock, Flame
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

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

const CITY_COST_FACTORS: Record<string, number> = {
  Mumbai: 1.25, Delhi: 1.20, Bangalore: 1.15, Chennai: 1.10,
  Hyderabad: 1.05, Pune: 1.10, Kolkata: 1.00, Ahmedabad: 0.95,
  Jaipur: 0.90, Lucknow: 0.88,
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
  return {
    title: `${surgery.name} Cost in India – ${minCost} to ${maxCost} | HealthExpress`,
    description: `${surgery.name} surgery cost in India ranges from ${minCost} to ${maxCost}. ${surgery.overview.substring(0, 120)}`,
    openGraph: {
      title: `${surgery.name} – HealthExpress India`,
      description: surgery.overview.substring(0, 160),
      type: 'article',
      locale: lang === 'hi' ? 'hi_IN' : 'en_IN',
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

function CityPricingTable({ cities, costMin, costMax }: { cities: string[]; costMin: number; costMax: number }) {
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
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  {row.city}
                </span>
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

      {/* Page Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-2xl" aria-hidden="true">{getCategoryIcon(surgery.category)}</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
            {surgery.insuranceLikely && (
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {dict.insurance_likely}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight tracking-tight">
            {surgery.name}
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
            {surgery.overview.split('.')[0]}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill icon={Clock}       label={dict.duration}      value={surgery.duration}                            />
            <StatPill icon={Building2}   label={dict.hospital_stay} value={surgery.hospitalStay}                        />
            <StatPill icon={HeartPulse}  label={dict.recovery}      value={surgery.recovery.split('.')[0]}              />
            <StatPill icon={IndianRupee} label={dict.est_cost}       value={`${formatCurrency(surgery.costRangeMin)}+`}  highlight />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={Stethoscope} title={dict.overview} />
              <p className="text-slate-700 leading-relaxed">{surgery.overview}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <SectionHeading icon={IndianRupee} title={dict.cost_insurance} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl p-5">
                  <p className="text-teal-200 text-xs font-semibold uppercase tracking-wider mb-1">{dict.cost_range}</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(surgery.costRangeMin)}
                    <span className="text-teal-300 text-xl"> – </span>
                    {formatCurrency(surgery.costRangeMax)}
                  </p>
                  <p className="text-teal-200 text-xs mt-2">{dict.cost_vary_note}</p>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{dict.insurance_coverage}</p>
                  <p className={`text-xl font-bold ${surgery.insuranceLikely ? 'text-green-600' : 'text-amber-600'}`}>
                    {surgery.insuranceLikely ? dictionary.surgeries.usually_covered : dict.may_not_be_covered}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">{dict.check_provider_note}</p>
                </div>
              </div>

              {surgery.availableCities.length > 0 && (
                <>
                  <h3 className="font-semibold text-slate-800 mt-7 mb-1 text-sm">Cost by City</h3>
                  <p className="text-xs text-slate-500 mb-2">Estimated ranges — actual costs depend on hospital tier and case complexity.</p>
                  <CityPricingTable cities={surgery.availableCities} costMin={surgery.costRangeMin} costMax={surgery.costRangeMax} />
                </>
              )}

              <div className="mt-5 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">{dict.cashless_treatment}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{dict.cashless_desc}</p>
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
          <aside className="lg:col-span-1 mt-8 lg:mt-0">
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
                <p className="text-sm text-slate-500 mb-6">{dict.form_subtitle}</p>
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
