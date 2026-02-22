import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: Promise<{ id: string; lang: string }>;
}

async function getDoctor(id: string) {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
            hospital: true,
            surgeries: true,
        },
    });
    return doctor;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id, lang } = await params;
    const doctor = await getDoctor(id);
    if (!doctor) return { title: 'Doctor Not Found' };

    return {
        title: `Dr. ${doctor.name} - ${doctor.qualification} | HealthExpress India`,
        description: doctor.about,
        alternates: {
            languages: {
                'en-IN': `/en/doctors/${id}`,
                'hi-IN': `/hi/doctors/${id}`,
            },
        },
    };
}

export async function generateStaticParams() {
    const doctors = await prisma.doctor.findMany({ select: { id: true } });
    const locales = ['en', 'hi'];
    const params: { id: string; lang: string }[] = [];

    doctors.forEach(doc => {
        locales.forEach(lang => {
            params.push({ id: doc.id, lang });
        });
    });

    return params;
}

export default async function DoctorProfilePage({ params }: PageProps) {
    const { id, lang } = await params;
    const doctor = await getDoctor(id);

    if (!doctor) {
        notFound();
    }

    const dictionary = await getDictionary(lang as Locale);
    const dict = dictionary.doctor_profile || {};
    const isHi = lang === 'hi';

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href={`/${lang}/doctors`} className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-8 inline-flex items-center gap-1 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> {isHi ? 'डॉक्टरों पर वापस जाएं' : 'Back to Doctors'}
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-4">
                    <div className="md:flex">
                        {/* Photo */}
                        <div className="md:w-64 h-64 md:h-auto bg-slate-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Dr. {doctor.name}</h1>
                                    <p className="text-teal-600 font-medium mt-1">{doctor.qualification}</p>
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
