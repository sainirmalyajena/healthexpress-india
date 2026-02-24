import type { Metadata } from "next";
import { Header, Footer, StickyMobileCTA } from "@/components/layout";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import Analytics from "@/components/Analytics";
import { generateOrganizationSchema } from "@/lib/schema";
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { GoogleTagManager } from '@next/third-parties/google';
import { MedBot } from "@/components/ui/MedBot";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isHi = lang === 'hi';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';

  return {
    title: {
      default: isHi ? "HealthExpress India - सर्जरी और अस्पताल सहायता" : "HealthExpress India - Surgery & Hospitalization Support",
      template: "%s | HealthExpress India",
    },
    description: isHi
      ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें। हमारी व्यापक सर्जरी डायरेक्टरी ब्राउज़ करें और शीर्ष स्वास्थ्य सेवा प्रदाताओं से जुड़ें।"
      : "Find the right surgery at the right hospital across India. Browse our comprehensive surgery directory and connect with top healthcare providers.",
    keywords: ["surgery", "hospital", "healthcare", "India", "medical", "treatment", "surgery cost", "hospital booking", "affordable surgery", "best surgeons india", "medical tourism india", "health packages", "delhi", "mumbai", "bangalore", "pune", "hyderabad", "chennai"],
    authors: [{ name: "HealthExpress India" }],
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en-IN': `${baseUrl}/en`,
        'hi-IN': `${baseUrl}/hi`,
      },
    },
    openGraph: {
      type: "website",
      locale: isHi ? "hi_IN" : "en_IN",
      url: `${baseUrl}/${lang}`,
      siteName: "HealthExpress India",
      title: isHi ? "HealthExpress India - सर्जरी और अस्पताल सहायता" : "HealthExpress India - Surgery & Hospitalization Support",
      description: isHi ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें।" : "Find the right surgery at the right hospital across India.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "HealthExpress India",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isHi ? "HealthExpress India - सर्जरी और अस्पताल सहायता" : "HealthExpress India - Surgery & Hospitalization Support",
      description: isHi ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें।" : "Find the right surgery at the right hospital across India.",
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(baseUrl),
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const organizationSchema = generateOrganizationSchema();
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={lang}>
      <head>
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col pb-[80px] md:pb-0 overflow-x-hidden font-sans antialiased text-slate-900 selection:bg-teal-100 selection:text-teal-900`}>
        <Analytics />
        <Header lang={lang} dict={dictionary.navigation} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dictionary.footer} />
        <MedBot lang={lang} />
        <WhatsAppButton />
        <StickyMobileCTA lang={lang} dict={dictionary.sticky_cta} />
        <SpeedInsights />
      </body>
    </html>
  );
}
