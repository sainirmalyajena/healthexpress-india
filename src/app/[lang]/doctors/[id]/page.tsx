import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { DoctorLeadForm } from '@/components/doctors/DoctorLeadForm';

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { generatePhysicianSchema, generateBreadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string; lang: string }>;
}

const getDoctor = cache(async (id: string) => {
    try {
        return await prisma.doctor.findUnique({
            where: { id },
            include: {
                hospital: true,
                surgeries: true,
            },
        });
    } catch (error) {
        console.warn(`[getDoctor] Failed for id ${id}:`, error);
        return null;
    }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, lang } = await params;
    const doctor = await getDoctor(id);
    if (!doctor) return { title: 'Doctor Not Found' };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
    const canonical = `${baseUrl}/${lang}/doctors/${id}`;

    return {
        title: `Dr. ${doctor.name} - ${doctor.qualification} | HealthExpress India`,
        description: doctor.about,
        alternates: {
            canonical: canonical,
            languages: {
                'en-IN': `${baseUrl}/en/doctors/${id}`,
                'hi-IN': `${baseUrl}/hi/doctors/${id}`,
            },
        },
    };
}

export async function generateStaticParams() {
    try {
        const doctors = await prisma.doctor.findMany({ select: { id: true } });
        const locales = ['en', 'hi'];
        const params: { id: string; lang: string }[] = [];

        doctors.forEach(doc => {
            locales.forEach(lang => {
                params.push({ id: doc.id, lang });
            });
        });

        return params;
    } catch (error) {
        console.warn('Failed to fetch doctors for static params, falling back to dynamic generation:', error);
        return [];
    }
}

export default async function DoctorProfilePage({ params }: PageProps) {
    const { id, lang } = await params;
    const doctor = await getDoctor(id);

    if (!doctor) {
        notFound();
    }

    const dictionary = await getDictionary(lang as Locale);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dict = dictionary.doctor_profile || {};
    const isHi = lang === 'hi';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';

    const physicianSchema = generatePhysicianSchema({
        name: doctor.name,
        image: doctor.image,
        description: doctor.about,
        qualification: doctor.qualification,
        experience: doctor.experience,
        accreditations: doctor.surgeries.map(s => s.name),
        hospitalName: doctor.hospital.name,
        hospitalCity: doctor.hospital.city,
        url: `${baseUrl}/${lang}/doctors/${doctor.id}`
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: isHi ? 'होम' : 'Home', url: `${baseUrl}/${lang}` },
        { name: isHi ? 'डॉक्टर' : 'Doctors', url: `${baseUrl}/${lang}/doctors` },
        { name: `Dr. ${doctor.name}`, url: `${baseUrl}/${lang}/doctors/${doctor.id}` },
    ]);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href={`/${lang}/doctors`} className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-8 inline-flex items-center gap-1 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> {isHi ? 'डॉक्टरों पर वापस जाएं' : 'Back to Doctors'}
                </Link>

                <div className="mt-4">
                    {/* Header - Full width, always on top */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mb-8">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Dr. {doctor.name}
                        </h1>
                        <p className="text-teal-600 font-bold text-lg md:text-xl">{doctor.qualification}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 border border-green-200/50 px-3 py-1 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> NMC Verified
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/50 px-3 py-1 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> NABH Partner
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/50 px-3 py-1 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {doctor.experience}+ {isHi ? 'वर्षों का अनुभव' : 'Years Exp'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
                        {/* Left on Desktop, Bottom on Mobile: Doctor Info & Hospital */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl font-medium">
                                    <span className="text-xl">🏥</span>
                                    <div>
                                        <p className="text-slate-900 font-bold">{doctor.hospital.name}</p>
                                        <p>{doctor.hospital.city}</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{isHi ? 'डॉक्टर के बारे में' : 'About the Doctor'}</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">{doctor.about}</p>
                                </div>

                                {/* Specialties */}
                                {doctor.surgeries.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{isHi ? 'प्रक्रियाएं और विशेषताएं' : 'Procedures & Specialties'}</h2>
                                        <div className="flex flex-wrap gap-2.5">
                                            {doctor.surgeries.map((surgery) => (
                                                <Link
                                                    key={surgery.id}
                                                    href={`/${lang}/surgeries/${surgery.slug}`}
                                                    className="px-4 py-2 bg-slate-50 text-slate-700 text-sm rounded-xl hover:bg-teal-50 hover:text-teal-700 border border-slate-100 hover:border-teal-200 transition-all font-bold shadow-sm"
                                                >
                                                    {surgery.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hospital Info */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">{isHi ? 'अस्पताल की जानकारी' : 'Hospital Information'}</h2>
                                <div className="grid sm:grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">{isHi ? 'अस्पताल का नाम' : 'Facility'}</p>
                                        <p className="font-bold text-slate-900 text-base">{doctor.hospital.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">{isHi ? 'शहर' : 'Location'}</p>
                                        <p className="font-bold text-slate-900 text-base">{doctor.hospital.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">{isHi ? 'मान्यता' : 'Accreditation'}</p>
                                        <p className="font-bold text-slate-900 text-base flex items-center gap-1.5"><span className="text-teal-600">✔</span> {isHi ? 'NABH मान्यता प्राप्त' : 'NABH Accredited'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">{isHi ? 'कैशलेस छूट' : 'Cashless Discount'}</p>
                                        <p className="font-bold text-teal-600 text-base">
                                            {doctor.hospital.discountPercent}% {isHi ? 'हेल्थ कार्ड के साथ छूट' : 'off with HealthExpress Card'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right on Desktop, Top on Mobile: Lead Form */}
                        <div className="lg:col-span-1" id="lead-form">
                            <div className="sticky top-24">
                                <DoctorLeadForm 
                                    doctorId={doctor.id} 
                                    doctorName={`Dr. ${doctor.name}`} 
                                    lang={lang} 
                                />
                                
                                <div className="mt-4 hidden lg:block">
                                    <a
                                        href={`https://wa.me/919307861041?text=${encodeURIComponent(isHi ? `नमस्ते, मैं डॉ. ${doctor.name} (${doctor.qualification}) से परामर्श करना चाहता हूँ` : `Hi, I want to consult Dr. ${doctor.name} (${doctor.qualification})`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-6 py-4 bg-white border-2 border-green-500 text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">💬</span> WhatsApp Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hospital Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">{isHi ? 'अस्पताल की जानकारी' : 'Hospital Information'}</h2>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">{isHi ? 'अस्पताल का नाम' : 'Hospital Name'}</p>
                            <p className="font-medium text-slate-900">{doctor.hospital.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">{isHi ? 'शहर' : 'City'}</p>
                            <p className="font-medium text-slate-900">{doctor.hospital.city}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">{isHi ? 'मान्यता' : 'Accreditation'}</p>
                            <p className="font-medium text-slate-900">{isHi ? 'NABH मान्यता प्राप्त' : 'NABH Accredited'}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">{isHi ? 'कैशलेस छूट' : 'Cashless Discount'}</p>
                            <p className="font-medium text-teal-600">
                                {doctor.hospital.discountPercent}% {isHi ? 'हेल्थ कार्ड के साथ छूट' : 'off with health card'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden z-50 flex items-center gap-3">
                <a 
                    href="#lead-form" 
                    className="flex-1 bg-teal-600 text-white font-bold py-3.5 px-4 rounded-xl text-center shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm"
                >
                    {isHi ? 'परामर्श बुक करें' : 'Book Consultation'}
                </a>
                <a 
                    href={`https://wa.me/919307861041?text=${encodeURIComponent(isHi ? `नमस्ते, मैं डॉ. ${doctor.name} (${doctor.qualification}) से परामर्श करना चाहता हूँ` : `Hi, I want to consult Dr. ${doctor.name} (${doctor.qualification})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                >
                    <span className="text-2xl">💬</span>
                </a>
            </div>
        </div>
    );
}
