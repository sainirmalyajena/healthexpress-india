import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { getSortedPostsData } from '@/lib/blog';

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
    const locales = ['en', 'hi'];

    // 1. Get all surgeries with their available cities
    const surgeries = await prisma.surgery.findMany({
        select: { slug: true, updatedAt: true, availableCities: true },
    });

    // 2. Get all active doctors
    const doctors = await prisma.doctor.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, updatedAt: true },
    });

    // 3. Get all blog posts
    let posts: { slug: string; date: string }[] = [];
    try {
        posts = await getSortedPostsData();
    } catch (e) {
        console.error('Failed to get blog posts for sitemap:', e);
    }

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 4. Generate static pages for each locale
    locales.forEach(locale => {
        // Home
        sitemapEntries.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        });
        // Surgeries listing
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/surgeries`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        });
        // Doctors listing
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/doctors`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        });
        // Blog listing
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
        // Contact
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        });
        // Privacy
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        });
        // Terms
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        });
    });

    // 5. Generate surgery detail pages & city-specific landing pages
    surgeries.forEach(surgery => {
        locales.forEach(locale => {
            // Main surgery page
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/surgeries/${surgery.slug}`,
                lastModified: surgery.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.8,
            });

            // City-specific landing pages
            if (surgery.availableCities && Array.isArray(surgery.availableCities)) {
                surgery.availableCities.forEach(city => {
                    sitemapEntries.push({
                        url: `${baseUrl}/${locale}/${city.toLowerCase()}/${surgery.slug}`,
                        lastModified: surgery.updatedAt,
                        changeFrequency: 'weekly',
                        priority: 0.9, // Higher priority for local SEO
                    });
                });
            }
        });
    });

    // 6. Generate doctor profile pages
    doctors.forEach(doctor => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/doctors/${doctor.id}`,
                lastModified: doctor.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    // 7. Generate blog post pages
    posts.forEach(post => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    return sitemapEntries;
}
