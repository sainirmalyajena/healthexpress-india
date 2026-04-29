import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google';
import "@/app/globals.css";

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

export const metadata: Metadata = {
  title: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
  description: 'Advanced eye treatments including Cataract, LASIK, Retina, and Glaucoma care by top ophthalmologists. Book your consultation today.',
  keywords: ['eye care', 'ophthalmology', 'cataract surgery', 'LASIK', 'retina care', 'glaucoma', 'eye specialist', 'Prism Healthcure'],
  authors: [{ name: 'Prism Healthcure' }],
  openGraph: {
    type: 'website',
    siteName: 'Prism Healthcure',
    title: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
    description: 'Advanced eye treatments by top ophthalmologists. Book your consultation today.',
    images: [{ url: '/prism-logo.jpg', width: 800, height: 600, alt: 'Prism Healthcure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
    description: 'Advanced eye treatments by top ophthalmologists.',
  },
};

export default function PrismLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
      {children}
    </div>
  );
}
