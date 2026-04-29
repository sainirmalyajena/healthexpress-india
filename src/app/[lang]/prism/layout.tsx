import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
    template: '%s | Prism Healthcure',
  },
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
};

export default function PrismLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
