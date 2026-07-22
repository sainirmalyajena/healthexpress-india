import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { DoctorEnquiryForm } from '@/components/doctors/DoctorEnquiryForm';
import { Metadata } from 'next';
import { Prisma } from '@/generated/prisma';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { generateCollectionPageSchema } from '@/lib/schema';

export const revalidate = 600; // ISR: revalidate every 10 minutes

interface PageProps {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ specialty?: string; city?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
    const canonical = `${baseUrl}/${lang}/doctors`;
    
    return {
        title: lang === 'hi' ? 'भारत में सर्वश्रेष्ठ सर्जन और डॉक्टर | HealthExpress' : 'Best Surgeons & Doctors in India | HealthExpress',
        description: lang === 'hi' ? 'अपने उपचार के लिए शीर्ष रेटेड सर्जनों और डॉक्टरों को खोजें। विशेषता, अनुभव और अस्पताल संबद्धता के आधार पर ब्राउज़ करें।' : 'Find top-rated surgeons and doctors for your treatment. Browse by specialty, experience, and hospital affiliation.',
        alternates: {
            canonical: canonical,
            languages: {
                'en-IN': `${baseUrl}/en/doctors`,
                'hi-IN': `${baseUrl}/hi/doctors`,
            },
        },
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
    const collectionSchema = generateCollectionPageSchema(
        dict.title,
        dict.subtitle,
        `${baseUrl}/doctors`
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
            
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl tracking-tight mb-4 leading-tight">
                        {dict.title}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        {dict.subtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: Directory */}
                    <div className="lg:col-span-8">
                        {/* Filters */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-3">
                            {specialtiesList.map(s => (
                                <Link
                                    key={s.id}
                                    href={`/${lang}/doctors?specialty=${s.id}`}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${specialty === s.id
                                        ? 'bg-teal-600 text-white shadow-md'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {s.label}
                                </Link>
                            ))}
                            <Link
                                href={`/${lang}/doctors`}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-transparent"
                            >
                                {dict.clear_filters}
                            </Link>
                        </div>

                        {/* Grid */}
                        {doctors.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} lang={lang} dict={dictionary.doctor_card} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-slate-500 text-lg font-medium">{dict.no_doctors_found}</p>
                                <Link href={`/${lang}/doctors`} className="text-teal-600 font-bold hover:underline mt-3 inline-block">
                                    {dict.view_all_doctors}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Form */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <DoctorEnquiryForm lang={lang} />
                    </div>
                </div>
            </div>
        </div>
    );
}
