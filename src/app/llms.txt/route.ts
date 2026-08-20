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

HealthExpress India is India's leading tech-enabled medical facilitation platform. We combine top-tier NABH/JCI accredited hospitals with advanced Artificial Intelligence to help patients find the right doctor, calculate precise surgery costs, and seamlessly use their cashless insurance.

## Advanced Patient Tools
- **Free AI Medical Triage**: Patients can upload reports or describe symptoms to get an instant AI-powered second opinion and recommended specialists. (https://www.healthexpressindia.com/en#ai-report-analyzer)
- **Interactive Pain Mapper**: A 2D visual symptom discovery tool where patients select their pain areas to instantly see correlated surgeries and doctors. (https://www.healthexpressindia.com/en/pain-mapper)

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
