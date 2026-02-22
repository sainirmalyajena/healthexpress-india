/**
 * Schema.org structured data generators for SEO
 * Generates JSON-LD markup for various schema types
 */

interface OrganizationSchemaOptions {
    name?: string;
    description?: string;
    url?: string;
    logo?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export function generateOrganizationSchema(options?: OrganizationSchemaOptions) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';
    const name = options?.name || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'HealthExpress India';
    const description = options?.description ||
        process.env.NEXT_PUBLIC_BUSINESS_DESCRIPTION ||
        'Connecting patients with 500+ hospitals across India for quality, affordable surgery';

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        description,
        url: options?.url || baseUrl,
        logo: options?.logo || `${baseUrl}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: options?.phone || process.env.NEXT_PUBLIC_PHONE || '+91 93078 61041',
            email: options?.email || process.env.NEXT_PUBLIC_EMAIL || 'hello@healthexpress.in',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi']
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
            addressLocality: 'New Delhi',
            addressRegion: 'Delhi',
            postalCode: '110024',
            streetAddress: options?.address || process.env.NEXT_PUBLIC_ADDRESS || 'C-120, 2nd Floor, Lajpat Nagar 1'
        },
        sameAs: [
            // Add social media profiles when available
        ]
    };
}

interface MedicalProcedureSchemaOptions {
    name: string;
    description: string;
    category: string;
    costMin: number;
    costMax: number;
    duration: string;
    hospitalStay: string;
    recovery: string;
    risks: string;
    preparation: string;
}

export function generateMedicalProcedureSchema(surgery: MedicalProcedureSchemaOptions) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        name: surgery.name,
        description: surgery.description,
        category: surgery.category,
        procedureType: {
            '@type': 'MedicalProcedureType',
            name: surgery.category
        },
        bodyLocation: surgery.category,
        status: 'http://schema.org/ActiveActionStatus',
        howPerformed: {
            '@type': 'String',
            name: 'Surgery'
        },
        preparation: surgery.preparation,
        followup: surgery.recovery,
        typicalAgeRange: '18-80',
        estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            minValue: surgery.costMin,
            maxValue: surgery.costMax
        },
        expectedProceduralTime: {
            '@type': 'Duration',
            name: surgery.duration
        },
        risk: [
            {
                '@type': 'MedicalRiskEstimator',
                name: 'General Surgical Risks',
                description: surgery.risks
            }
        ],
        provider: {
            '@type': 'MedicalOrganization',
            name: 'HealthExpress India',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: process.env.NEXT_PUBLIC_PHONE || '+91 93078 61041',
                contactType: 'customer service'
            }
        },
        medicalSpecialty: {
            '@type': 'MedicalSpecialty',
            name: surgery.category
        }
    };
}

interface FAQItem {
    question: string;
    answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

interface LocalBusinessSchemaOptions {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export function generateLocalBusinessSchema(options?: LocalBusinessSchemaOptions) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: options?.name || 'HealthExpress India',
        description: options?.description || 'Healthcare coordination and surgery support services',
        url: baseUrl,
        telephone: options?.phone || process.env.NEXT_PUBLIC_PHONE || '+91 93078 61041',
        email: options?.email || process.env.NEXT_PUBLIC_EMAIL || 'hello@healthexpress.in',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
            addressLocality: options?.city || 'New Delhi',
            addressRegion: 'Delhi',
            postalCode: '110024',
            streetAddress: options?.address || process.env.NEXT_PUBLIC_ADDRESS || 'C-120, 2nd Floor, Lajpat Nagar 1'
        },
        geo: options?.latitude && options?.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: options.latitude,
            longitude: options.longitude
        } : undefined,
        priceRange: '₹₹',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '18:00'
        },
        areaServed: {
            '@type': 'Country',
            name: 'India'
        }
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

export function generateCollectionPageSchema(name: string, description: string, url: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url,
        publisher: {
            '@type': 'MedicalOrganization',
            name: 'HealthExpress India'
        }
    };
}
