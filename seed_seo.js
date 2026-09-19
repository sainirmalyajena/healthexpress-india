const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function populate() {
    await prisma.seoOpportunity.deleteMany({});
    
    await prisma.seoQueryData.create({
        data: {
            query: 'healthexpress india',
            landingPage: '/',
            impressions: 450,
            clicks: 150,
            ctr: 0.33,
            position: 1.2,
            isBranded: true,
            date: new Date()
        }
    });

    await prisma.seoOpportunity.create({
        data: {
            type: 'QUICK_WIN',
            query: 'best eye hospital in mumbai',
            landingPage: '/en/surgeries/cataract-surgery',
            impressions: 800,
            position: 5.6,
            intent: 'Local Commercial',
            score: 85,
            recommendation: JSON.stringify({
                title: 'Best Eye Hospital in Mumbai - HealthExpress',
                h1: 'Mumbai\\'s Top Eye Hospital for Cataract & LASIK',
                action: 'expand',
                supportingContent: 'Add Google Maps embed and patient testimonials.'
            }),
            status: 'OPEN'
        }
    });

    await prisma.seoOpportunity.create({
        data: {
            type: 'GAP',
            query: 'gallbladder stone removal cost',
            landingPage: '/',
            impressions: 400,
            position: 45.3,
            intent: 'Commercial Investigation',
            score: 70,
            recommendation: JSON.stringify({
                title: 'Gallbladder Stone Removal Cost in India',
                h1: 'Understanding Gallbladder Surgery Costs',
                action: 'new_page',
                supportingContent: 'Need a dedicated cost breakdown page for Gallbladder surgery.'
            }),
            status: 'OPEN'
        }
    });

    console.log('Mock data seeded.');
}
populate();
