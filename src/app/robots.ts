import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers();
    const hostname = headersList.get('host') || '';
    const isPrismDomain = hostname.includes('prismhealthcure.com') || process.env.NEXT_PUBLIC_SITE_BRAND === 'prism';
    
    const baseUrl = isPrismDomain 
        ? 'https://prismhealthcure.com' 
        : (process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com');

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
