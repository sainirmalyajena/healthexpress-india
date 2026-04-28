import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import Analytics from "@/components/Analytics";
import { generateOrganizationSchema } from "@/lib/schema";
import { Inter, Outfit } from 'next/font/google';
import "@/app/globals.css";
import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientLayoutWidgets } from "@/components/layout/ClientLayoutWidgets";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isHi = lang === 'hi';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prismhealthcure.com';

  return {
    title: {
      default: isHi ? "Prism Healthcure - सर्जरी और अस्पताल सहायता" : "Prism Healthcure - Surgery & Hospitalization Support",
      template: "%s | Prism Healthcure",
    },
    description: isHi
      ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें। हमारी व्यापक सर्जरी डायरेक्टरी ब्राउज़ करें और शीर्ष स्वास्थ्य सेवा प्रदाताओं से जुड़ें।"
      : "Find the right surgery at the right hospital across India. Browse our comprehensive surgery directory and connect with top healthcare providers.",
    keywords: ["surgery", "hospital", "healthcare", "India", "medical", "treatment", "surgery cost", "hospital booking", "affordable surgery", "best surgeons india", "medical tourism india", "health packages", "delhi", "mumbai", "bangalore", "pune", "hyderabad", "chennai"],
    authors: [{ name: "Prism Healthcure" }],
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
      siteName: "Prism Healthcure",
      title: isHi ? "Prism Healthcure - सर्जरी और अस्पताल सहायता" : "Prism Healthcure - Surgery & Hospitalization Support",
      description: isHi ? "भारत भर के सही अस्पताल में सही सर्जरी खोजें।" : "Find the right surgery at the right hospital across India.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Prism Healthcure",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isHi ? "Prism Healthcure - सर्जरी और अस्पताल सहायता" : "Prism Healthcure - Surgery & Hospitalization Support",
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
  return (
    <html lang={lang} className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col pb-[80px] md:pb-0 overflow-x-hidden font-sans antialiased text-slate-900 selection:bg-teal-900 selection:text-white">
        <Analytics />
        <Header lang={lang} dict={dictionary.navigation} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dictionary.footer} />
        <ClientLayoutWidgets lang={lang} dict={dictionary.sticky_cta} />
        <SpeedInsights />
      </body>
    </html>
  );
}

