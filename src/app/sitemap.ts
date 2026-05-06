import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = await headers();
    const hostname = headersList.get('host') || '';
    const isPrismDomain = hostname.includes('prismhealthcure.com') || process.env.NEXT_PUBLIC_SITE_BRAND === 'prism';

    if (isPrismDomain) {
        const prismBaseUrl = 'https://prismhealthcure.com';
        const locales = ['en', 'hi'];
        
        const prismPages: MetadataRoute.Sitemap = [];
        
        locales.forEach(locale => {
            // Main page for each locale
            prismPages.push({
                url: `${prismBaseUrl}/${locale}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            });
            
            // Subpages for each locale
            prismPages.push({
                url: `${prismBaseUrl}/${locale}/privacy`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.3,
            });
            
            prismPages.push({
                url: `${prismBaseUrl}/${locale}/terms`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.3,
            });
        });

        return prismPages;
    }

    // Default HealthExpress Sitemap logic...
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';

    // Get all surgeries
    const surgeries = await prisma.surgery.findMany({
        select: { slug: true, updatedAt: true },
    });

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/surgeries`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Surgery pages
    const surgeryPages: MetadataRoute.Sitemap = surgeries.map((surgery) => ({
        url: `${baseUrl}/surgeries/${surgery.slug}`,
        lastModified: surgery.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...surgeryPages];
}
