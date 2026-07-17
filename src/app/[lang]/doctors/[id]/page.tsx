import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Image from 'next/image';

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

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-4">
                    <div className="md:flex">
                        {/* Photo */}
                        <div className="md:w-64 h-64 md:h-auto bg-slate-100 flex-shrink-0 relative overflow-hidden">
                            <Image
                                src={doctor.image}
                                alt={doctor.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 256px"
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Info */}
                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        Dr. {doctor.name}
                                    </h1>
                                    <p className="text-teal-600 font-medium mt-1">{doctor.qualification}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-green-50 text-green-700 border border-green-200/50 px-2 py-0.5 rounded">
                                            ✔ NMC Verified
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-teal-50 text-teal-700 border border-teal-200/50 px-2 py-0.5 rounded">
                                            ✔ NABH Affiliated Partner
                                        </span>
                                    </div>
                                </div>
                                <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                                    {doctor.experience}+ {isHi ? 'वर्षों का अनुभव' : 'Years Exp'}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span>🏥</span>
                                <span className="font-medium text-slate-700">{doctor.hospital.name}</span>
                                <span>•</span>
                                <span>{doctor.hospital.city}</span>
                            </div>

                            <p className="mt-6 text-slate-600 leading-relaxed">{doctor.about}</p>

                            {/* Specialties */}
                            {doctor.surgeries.length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-sm font-semibold text-slate-900 mb-3">{isHi ? 'प्रक्रियाएं और विशेषताएं' : 'Procedures & Specialties'}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.surgeries.map((surgery) => (
                                            <Link
                                                key={surgery.id}
                                                href={`/${lang}/surgeries/${surgery.slug}`}
                                                className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm rounded-full hover:bg-teal-100 transition-colors font-medium"
                                            >
                                                {surgery.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={`/${lang}/contact?doctor=${encodeURIComponent(doctor.name)}`}
                                    className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95"
                                >
                                    {isHi ? 'परामर्श बुक करें' : 'Book Consultation'}
                                </Link>
                                <a
                                    href={`https://wa.me/919307861041?text=${encodeURIComponent(isHi ? `नमस्ते, मैं डॉ. ${doctor.name} (${doctor.qualification}) से परामर्श करना चाहता हूँ` : `Hi, I want to consult Dr. ${doctor.name} (${doctor.qualification})`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                                >
                                    💬 WhatsApp
                                </a>
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
        </div>
    );
}
