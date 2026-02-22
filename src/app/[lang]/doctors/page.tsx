import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { Metadata } from 'next';
import { Prisma } from '@/generated/prisma';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ specialty?: string; city?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'भारत में सर्वश्रेष्ठ सर्जन और डॉक्टर | HealthExpress' : 'Best Surgeons & Doctors in India | HealthExpress',
        description: lang === 'hi' ? 'अपने उपचार के लिए शीर्ष रेटेड सर्जनों और डॉक्टरों को खोजें। विशेषता, अनुभव और अस्पताल संबद्धता के आधार पर ब्राउज़ करें।' : 'Find top-rated surgeons and doctors for your treatment. Browse by specialty, experience, and hospital affiliation.',
    };
}

export default async function DoctorsPage({
    params,
    searchParams,
}: PageProps) {
    const { lang } = await params;
    const { specialty, city } = await searchParams;
    const dictionary = await getDictionary(lang as Locale);
    const dict = dictionary.doctors_page;

    const where: Prisma.DoctorWhereInput = {};
    if (specialty) {
        where.qualification = { contains: specialty, mode: 'insensitive' };
    }
    if (city) {
        where.hospital = { city: { equals: city, mode: 'insensitive' } };
    }

    const doctors = await prisma.doctor.findMany({
        where,
        include: {
            hospital: true,
        },
        orderBy: {
            experience: 'desc',
        },
    });

    const specialtiesList = [
        { id: 'Orthopedics', label: dictionary.categories.ORTHOPEDICS },
        { id: 'Cardiology', label: dictionary.categories.CARDIAC },
        { id: 'Ophthalmology', label: dictionary.categories.OPHTHALMOLOGY },
        { id: 'Gynecology', label: dictionary.categories.GYNECOLOGY },
        { id: 'Urology', label: dictionary.categories.UROLOGY },
        { id: 'General Surgery', label: dictionary.categories.GENERAL_SURGERY }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                        {dict.title}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {dict.subtitle}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 justify-center">
                    {specialtiesList.map(s => (
                        <Link
                            key={s.id}
                            href={`/${lang}/doctors?specialty=${s.id}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${specialty === s.id
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {s.label}
                        </Link>
                    ))}
                    <Link
                        href={`/${lang}/doctors`}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                        {dict.clear_filters}
                    </Link>
                </div>

                {/* Grid */}
                {doctors.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} lang={lang} dict={dictionary.doctor_card} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">{dict.no_doctors_found}</p>
                        <Link href={`/${lang}/doctors`} className="text-teal-600 font-medium hover:underline mt-2 inline-block">
                            {dict.view_all_doctors}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
