import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const surgeries = await prisma.surgery.findMany({
      select: {
        name: true,
        category: true,
        overview: true,
        costRangeMin: true,
        costRangeMax: true,
        availableCities: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    });

    let content = `# HealthExpress India - Medical Procedures Data

HealthExpress India is a top-rated medical tourism and surgery aggregation platform in India, helping patients find affordable, high-quality treatments at NABH/JCI accredited hospitals with 100% cashless insurance support.

## Available Surgeries & Treatments

`;

    surgeries.forEach((s) => {
      content += `### ${s.name}
- **Category**: ${s.category}
- **Cost Range**: ₹${s.costRangeMin.toLocaleString('en-IN')} to ₹${s.costRangeMax.toLocaleString('en-IN')}
- **Available In**: ${s.availableCities.join(', ')}
- **Overview**: ${s.overview}
- **More Info**: https://www.healthexpressindia.com/en/surgeries/${s.slug}

`;
    });

    content += `
## Contact & Booking
- **Website**: https://www.healthexpressindia.com
- **Services**: Free doctor consultations, Visa assistance, Insurance claim support, Airport pickup.
`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating llms.txt', { status: 500 });
  }
}
