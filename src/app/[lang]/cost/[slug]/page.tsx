import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Calculator, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { LeadForm } from '@/components/forms/LeadForm';

interface PageProps {
    params: Promise<{ lang: string; slug: string }>;
}

async function getSurgeryData(slug: string) {
    return prisma.surgery.findUnique({
        where: { slug },
        include: {
            doctors: {
                include: { hospital: true },
                take: 3
            }
        }
    });
}

export async function generateStaticParams() {
    try {
        const surgeries = await prisma.surgery.findMany({ select: { slug: true } });
        return surgeries.map((s) => ({ slug: s.slug }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const surgery = await getSurgeryData(slug);
    
    if (!surgery) return { title: 'Not Found' };
    
    const title = `Cost of ${surgery.name} in India 2026 | HealthExpress`;
    const description = `Find the exact cost of ${surgery.name} in India. Prices range from ${formatCurrency(surgery.costRangeMin)} to ${formatCurrency(surgery.costRangeMax)}. 100% Cashless Insurance available.`;

    return {
        title,
        description,
        openGraph: { title, description },
    };
}

export default async function CostPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const surgery = await getSurgeryData(slug);
    
    if (!surgery) notFound();
    
    const dict = await getDictionary(lang as Locale);
    
    const minCost = formatCurrency(surgery.costRangeMin);
    const maxCost = formatCurrency(surgery.costRangeMax);
    const avgCost = Math.floor((surgery.costRangeMin + surgery.costRangeMax) / 2);
    const avgCostStr = formatCurrency(avgCost);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `How much does ${surgery.name} cost in India?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `The average cost of ${surgery.name} in India ranges from ${minCost} to ${maxCost}. The exact price depends on the hospital, city, and surgeon's experience.`
                }
            },
            {
                '@type': 'Question',
                name: `Is ${surgery.name} covered by insurance?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: surgery.insuranceLikely 
                        ? `Yes, ${surgery.name} is generally covered by most health insurance policies in India. HealthExpress India provides full cashless insurance support.`
                        : `Coverage for ${surgery.name} depends on medical necessity and your specific health insurance policy.`
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* SEO Hero */}
            <div className="bg-slate-900 text-white pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-teal-500/30">
                        <Calculator className="w-3 h-3" /> Cost Calculator
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        How much does <span className="text-teal-400">{surgery.name}</span> cost in India?
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl">
                        The average cost of {surgery.name} in top Indian hospitals ranges from {minCost} to {maxCost}. Get a precise, personalized quote today with 100% Cashless Insurance support.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Price Breakdown Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cost Breakdown (2026 Estimates)</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Starting From</p>
                                    <p className="text-2xl font-bold text-slate-900">{minCost}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 text-center transform scale-105 shadow-sm">
                                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Average Cost</p>
                                    <p className="text-2xl font-bold text-teal-900">{avgCostStr}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Maximum Cost</p>
                                    <p className="text-2xl font-bold text-slate-900">{maxCost}</p>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-slate-900 mb-4">What's included in this estimate?</h3>
                            <ul className="space-y-3">
                                {[
                                    'Surgeon & Anesthetist Fees',
                                    'Operation Theatre (OT) Charges',
                                    `Hospital Stay (${surgery.recovery || 'Standard'} days)`,
                                    'Standard Implants/Consumables',
                                    'Pre-op Investigations (Basic)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-4">
                                <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-amber-900 mb-1">Insurance Coverage</p>
                                    <p className="text-sm text-amber-800">
                                        {surgery.insuranceLikely 
                                            ? `Good news! ${surgery.name} is generally covered by health insurance. We provide full cashless assistance.` 
                                            : `Coverage depends on your specific policy and medical necessity. Talk to our experts.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Top Doctors */}
                        {surgery.doctors.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Specialists for {surgery.name}</h2>
                                <div className="space-y-4">
                                    {surgery.doctors.map(doc => (
                                        <div key={doc.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-slate-50 transition-colors">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900">{doc.name}</h3>
                                                <p className="text-sm text-slate-500 mb-2">{doc.qualification} • {doc.experience} Years Exp.</p>
                                                <p className="text-xs font-medium text-teal-600 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {doc.hospital.name}, {doc.hospital.city}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <Link href={`/${lang}/surgeries/${surgery.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                        View Full Surgery Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-2">Get an Exact Quote</h3>
                            <p className="text-sm text-slate-500 mb-6">Share your details and our medical experts will provide a customized cost estimate from top hospitals.</p>
                            <LeadForm surgeryId={surgery.id} surgeryName={surgery.name} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

