import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
    template: '%s | Prism Healthcure',
  },
  description: 'Advanced eye treatments including Cataract, LASIK, Retina, and Glaucoma care by top ophthalmologists. Book your consultation today.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  },
  keywords: ['ophthalmology India', 'cataract surgery cost', 'LASIK eye surgery', 'best eye doctor Delhi', 'retina specialist', 'glaucoma treatment', 'cashless eye surgery', 'Prism Healthcure', 'eye care network'],
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
