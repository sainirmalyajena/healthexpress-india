import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import ContactClient from './ContactClient';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'संपर्क करें | HealthExpress' : 'Contact Us | HealthExpress India',
        description: lang === 'hi' ? 'सर्जरी या उपचार के बारे में विशेषज्ञ मार्गदर्शन के लिए HealthExpress India से संपर्क करें।' : 'Get in touch with HealthExpress India for expert guidance on surgeries and treatments.',
    };
}

export default async function ContactPage({ params }: PageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return <ContactClient lang={lang} dict={dictionary.contact_page} />;
}
