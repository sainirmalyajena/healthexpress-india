import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGscData } from '@/lib/gsc';
import { isBranded, analyzeQueryIntent } from '@/lib/seo-analyzer';

export async function GET(req: Request) {
    // In production, you would verify the cron secret here
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== \Bearer \\) return new Response('Unauthorized', { status: 401 });

    try {
        const siteUrl = 'https://healthexpressindia.com/';
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const startDate = sevenDaysAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];

        // 1. Fetch GSC Data
        const gscData = await getGscData(siteUrl, startDate, endDate);

        // 2. Clear old opportunities (or keep history depending on strategy)
        // For simplicity, we just clear and repopulate weekly opportunities
        await prisma.seoOpportunity.deleteMany({});
        // await prisma.seoQueryData.deleteMany({}); // Optional: clear old raw data

        // 3. Process and Store Data
        const opportunities = [];
        
        for (const row of gscData) {
            const query = row.keys?.[0] || '';
            const page = row.keys?.[1] || '';
            const country = row.keys?.[2] || '';
            const device = row.keys?.[3] || '';
            
            const impressions = row.impressions || 0;
            const clicks = row.clicks || 0;
            const ctr = row.ctr || 0;
            const position = row.position || 0;

            const branded = isBranded(query);

            // Save raw query data
            await prisma.seoQueryData.create({
                data: {
                    query,
                    landingPage: page,
                    impressions,
                    clicks,
                    ctr,
                    position,
                    device,
                    country,
                    isBranded: branded,
                    date: new Date()
                }
            });

            // Analyze non-branded queries with meaningful impressions or positions
            if (!branded && impressions > 50) {
                // Rate limit/batching would be needed for real Gemini usage across 5000 queries
                const analysis = await analyzeQueryIntent(query, position, impressions, page);
                
                if (analysis) {
                    await prisma.seoOpportunity.create({
                        data: {
                            type: analysis.type,
                            query,
                            landingPage: page,
                            impressions,
                            position,
                            intent: analysis.intent,
                            score: analysis.score,
                            recommendation: JSON.stringify(analysis.recommendations),
                            status: 'OPEN'
                        }
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: 'SEO Sync Complete' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
