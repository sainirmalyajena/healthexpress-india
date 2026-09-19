import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGscData } from '@/lib/gsc';
import { isBranded, analyzeQueryIntent } from '@/lib/seo-analyzer';

export async function GET(req: Request) {
    try {
        const siteUrl = 'https://healthexpressindia.com/';
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const startDate = sevenDaysAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];

        const gscData = await getGscData(siteUrl, startDate, endDate);

        // Keep historical data for trend analysis, so don't delete SeoQueryData
        // But we DO want to refresh SeoOpportunities that are OPEN
        await prisma.seoOpportunity.deleteMany({ where: { status: 'OPEN' } });

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

            if (!branded && impressions > 20) {
                const analysis = await analyzeQueryIntent(query, position, impressions, page);
                
                if (analysis) {
                    await prisma.seoOpportunity.create({
                        data: {
                            type: analysis.type,
                            query,
                            landingPage: page,
                            impressions,
                            clicks,
                            ctr,
                            position,
                            intent: analysis.intent,
                            businessCapability: analysis.businessCapability,
                            revenueIntent: analysis.revenueIntent,
                            trendStatus: 'New', // Simple trend for now
                            score: analysis.score,
                            recommendation: JSON.stringify(analysis.recommendations),
                            status: 'OPEN'
                        }
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Production SEO Sync Complete' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
