import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { getDictionary } from '@/get-dictionary';
import { Hero } from '@/components/home/Hero';
import type { Locale } from '@/i18n-config';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui';
import { generateFAQSchema, generateLocalBusinessSchema } from '@/lib/schema';

const categories = [
  'GENERAL_SURGERY',
  'ORTHOPEDICS',
  'UROLOGY',
  'ENT',
  'GYNECOLOGY',
  'OPHTHALMOLOGY',
  'CARDIAC',
  'NEURO',
  'GASTRO',
  'DENTAL',
  'COSMETIC',
  'PEDIATRIC',
  'ONCOLOGY'
];
const HowItWorks = dynamic(() => import('@/components/home/HowItWorks'));
import TrustCards from '@/components/home/TrustCards';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isHi = lang === 'hi';
  const title = isHi ? "HealthExpress India - सर्जरी और अस्पताल सहायता" : "HealthExpress India - Surgery & Hospitalization Support";
  const description = isHi 
    ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें। हमारी व्यापक सर्जरी डायरेक्टरी ब्राउज़ करें और शीर्ष स्वास्थ्य सेवा प्रदाताओं से जुड़ें।" 
    : "Find the right surgery at the right hospital across India. Browse our comprehensive surgery directory and connect with top healthcare providers.";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
  const canonical = `${baseUrl}/${lang}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "HealthExpress India",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HealthExpress India" }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const faqs = [
    {
      question: lang === 'hi' ? 'HealthExpress India क्या है?' : 'What is HealthExpress India?',
      answer: lang === 'hi'
        ? 'HealthExpress India एक प्रीमियम स्वास्थ्य सेवा मंच है जो रोगियों को भारत के अग्रणी अस्पतालों और अत्यधिक अनुभवी सर्जनों से जोड़ता है। हम पूरी चिकित्सा यात्रा के दौरान एंड-टू-एंड सहायता प्रदान करते हैं।'
        : 'HealthExpress India is a premium healthcare platform that connects patients with leading hospitals and highly experienced surgeons across India, providing end-to-end support throughout the medical journey.'
    },
    {
      question: lang === 'hi' ? 'क्या HealthExpress India कोई परामर्श शुल्क लेता है?' : 'Does HealthExpress India charge any consultation fee?',
      answer: lang === 'hi'
        ? 'नहीं, रोगियों के लिए हमारा मार्गदर्शन और देखभाल समन्वय सेवाएं पूरी तरह से निःशुल्क हैं। हम आपकी सहायता के लिए कोई छिपी हुई फीस या अतिरिक्त शुल्क नहीं लेते हैं।'
        : 'No, our care coordination and guidance services are completely free for patients. We do not charge any hidden fees or extra costs.'
    },
    {
      question: lang === 'hi' ? 'अस्पताल नेटवर्क में कौन से प्रमुख अस्पताल शामिल हैं?' : 'Which major hospitals are in the network?',
      answer: lang === 'hi'
        ? 'हमारे नेटवर्क में ASG Eye Hospital, Manipal, और Mumbai Eye Care जैसे भारत के 500 से अधिक विशिष्ट अस्पताल शामिल हैं, जो JCI और NABH मानकों द्वारा मान्यता प्राप्त हैं।'
        : 'Our network includes over 500 elite hospitals across India, such as ASG Eye Hospital, Manipal, and Mumbai Eye Care, all accredited by JCI and NABH standards.'
    },
    {
      question: lang === 'hi' ? 'क्या मेरी स्वास्थ्य बीमा पॉलिसी यहाँ मान्य होगी?' : 'Will my health insurance policy be accepted?',
      answer: lang === 'hi'
        ? 'हाँ, हम सभी प्रमुख स्वास्थ्य बीमा प्रदाताओं के साथ काम करते हैं ताकि आपको कैशलेस सर्जरी उपचार मिल सके। हमारी टीम आपके कवरेज को सत्यापित करने और क्लेम प्रक्रिया में सहायता करती है।'
        : 'Yes, we work closely with major health insurance providers to facilitate cashless surgical treatments. Our team helps verify your policy coverage and assists with the pre-authorization claim process.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const orgSchema = generateLocalBusinessSchema();

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: `[${JSON.stringify(faqSchema)}, ${JSON.stringify(orgSchema)}]` }}
      />
      {/* Hero Section */}
      <Hero lang={lang} dict={dict.hero} />

      {/* Trust Cards Section */}
      <TrustCards lang={lang} dict={dict.trust_cards} />

      {/* Surgery Categories Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Browse by Specialty</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'hi' ? 'अपनी सर्जरी खोजें' : 'All Surgical Specialties'}
              </h2>
            </div>
            <Link
                href={`/${lang}/surgeries`}
                className="flex items-center gap-2 text-sm text-teal-600 font-bold hover:text-teal-800 transition-colors"
            >
                {lang === 'hi' ? 'सभी देखें' : 'View All Surgeries'}
                <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/${lang}/surgeries?category=${category}`}
                className="group flex flex-col items-center justify-center gap-2.5 py-5 px-2 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-md"
                  style={{
                    background: `hsl(${(index * 43) % 360}, 65%, 55%)`,
                  }}
                >
                  <CategoryIcon category={category} className="w-6 h-6" />
                </div>
                
                <span className="text-[11px] md:text-xs font-bold text-slate-700 group-hover:text-teal-700 transition-colors leading-tight">
                  {getCategoryLabel(category, dict.categories)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <div className="space-y-0">
        <HowItWorks lang={lang} dict={dict.how_it_works} />
      </div>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium">
              {lang === 'hi' ? 'HealthExpress India के बारे में सभी आवश्यक जानकारी यहाँ पाएं' : 'Find answers to common questions about HealthExpress India'}
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 flex items-start gap-3">
                  <span className="text-teal-500 font-extrabold">Q.</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Bottom CTA */}
      <section className="py-10 md:py-16 bg-[#fdfdfd] px-4">
        <div className="max-w-6xl mx-auto rounded-[3rem] bg-slate-900 p-8 md:p-12 text-center text-white shadow-premium relative overflow-hidden">
          {/* Visual Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[90px] translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-teal-400 text-xs font-black uppercase tracking-[0.4em] mb-10">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
              </span>
              {lang === 'hi' ? 'मुफ़्त परामर्श' : 'Immediate Access'}
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-[1.05] tracking-tighter">
              {dict.cta.title}
            </h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
              {dict.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center font-bold rounded-[1.5rem] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 relative bg-gradient-to-r from-teal-400 to-teal-600 text-white shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] hover:scale-[1.02] border border-teal-300/30 text-lg px-12 py-5"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {dict.cta.estimate}
                </span>
              </Link>
              <a
                href="tel:9307861041"
                className="group flex items-center justify-center gap-4 px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-base rounded-[1.5rem] hover:bg-white/20 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5 text-teal-400 transition-transform group-hover:rotate-12" />
                {dict.cta.call}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

