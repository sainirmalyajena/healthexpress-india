import type { Metadata } from "next";
import { Header, Footer, ConditionalShell } from "@/components/layout";
import Analytics from "@/components/Analytics";
import { generateOrganizationSchema } from "@/lib/schema";
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import "@/app/globals.css";
import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { ClientLayoutWidgets } from "@/components/layout/ClientLayoutWidgets";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isHi = lang === 'hi';
  
  const forcedBrand = process.env.NEXT_PUBLIC_SITE_BRAND;
  const isPrismSite = forcedBrand === 'prism';

  if (isPrismSite) {
    const prismTitle = 'Prism Healthcure | Premium Ophthalmology & Eye Care';
    const prismDesc = 'Advanced eye treatments including Cataract, LASIK, and Retina care by top ophthalmologists. Book your consultation today.';
    const prismBaseUrl = 'https://prismhealthcure.com';
    
    return {
      title: prismTitle,
      description: prismDesc,
      metadataBase: new URL(prismBaseUrl),
      alternates: {
        canonical: `${prismBaseUrl}/${lang}`,
        languages: {
          'en-IN': `${prismBaseUrl}/en`,
          'hi-IN': `${prismBaseUrl}/hi`,
        },
      },
      openGraph: {
        title: prismTitle,
        description: prismDesc,
        url: `${prismBaseUrl}/${lang}`,
        siteName: 'Prism Healthcure',
        images: [{ url: '/prism-logo.jpg', width: 1200, height: 630, alt: 'Prism Healthcure' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: prismTitle,
        description: prismDesc,
      },
      icons: {
        icon: '/prism-logo.jpg',
        apple: '/prism-logo.jpg',
      },
      robots: {
        index: true,
        follow: true,
      }
    };
  }

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
  
  // Safe dictionary loading
  let dictionary;
  try {
    dictionary = await getDictionary(lang as Locale);
  } catch (e) {
    console.error('Dictionary load error:', e);
    dictionary = await getDictionary('en');
  }
  
  const organizationSchema = generateOrganizationSchema();
  
  const forcedBrand = process.env.NEXT_PUBLIC_SITE_BRAND;
  const isPrismSite = forcedBrand === 'prism';
  
  // Header and Footer visibility is now handled by the components themselves via usePathname
  const hideMainNav = isPrismSite;

  return (
      <html lang={lang} className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <head>
          {/* Resource hints for external origins */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://wa.me" />
          {!isPrismSite && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema)
              }}
            />
          )}

          {/* Meta Pixel Code */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2647191662345776');
              fbq('track', 'PageView');
            `}
          </Script>
        </head>
        <body className={`min-h-screen flex flex-col ${hideMainNav ? '' : 'pb-[80px] md:pb-0'} overflow-x-hidden font-sans antialiased text-slate-900 selection:bg-teal-900 selection:text-white`}>
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=2647191662345776&ev=PageView&noscript=1" alt="" />
          </noscript>
          <Analytics />
          
          {/* Only show HealthExpress Header/Footer/Sticky on main pages (not Prism or Campaign) */}
          {!hideMainNav && (
            <Header lang={lang} dict={dictionary.navigation} />
          )}

          <main className="flex-1">{children}</main>

          {!hideMainNav && (
            <>
              <Footer lang={lang} dict={dictionary.footer} />
              <ClientLayoutWidgets lang={lang} dict={dictionary.sticky_cta} />
            </>
          )}

          <SpeedInsights />
          <VercelAnalytics />
        </body>
      </html>
    );
}
