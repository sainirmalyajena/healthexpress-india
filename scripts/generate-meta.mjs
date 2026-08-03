import { PrismaClient } from '../src/generated/prisma/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize custom prisma client to point to generated one
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Increase this if using a paid Gemini tier, or keep low to avoid 429
const CONCURRENCY = 2;
const BATCH_SIZE = 50;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateMetaDescription(surgery) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a medical SEO expert in India. 
Write a highly-clickable, persuasive Meta Description (under 155 characters) for the following surgery page to maximize Click-Through Rate (CTR).
Include words like "affordable", "cost", "cashless insurance" or "top doctors" where appropriate.
DO NOT use quotes around the output.

Surgery Name: ${surgery.name}
Cost Range: ₹${surgery.costRangeMin.toLocaleString('en-IN')} to ₹${surgery.costRangeMax.toLocaleString('en-IN')}
Overview: ${surgery.overview.substring(0, 200)}...

Return ONLY the meta description string.`;

    let retries = 3;
    while (retries > 0) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim().replace(/^"|"$/g, '');
            return text.substring(0, 160); // Safety limit
        } catch (error) {
            console.error(`Error generating for ${surgery.name}:`, error?.message || 'Unknown Error');
            if (error?.message?.includes('429')) {
                console.log('Rate limited! Waiting 15 seconds...');
                await sleep(15000);
                retries--;
            } else {
                return null;
            }
        }
    }
    return null;
}

async function main() {
    console.log('Fetching all surgeries missing meta descriptions...');
    
    // We only fetch those that haven't been generated yet
    const surgeries = await prisma.surgery.findMany({
        where: {
            OR: [
                { metaDescription: null },
                { metaDescription: '' }
            ]
        },
        select: { id: true, name: true, costRangeMin: true, costRangeMax: true, overview: true }
    });

    console.log(`Found ${surgeries.length} surgeries to process.`);

    let processed = 0;
    
    for (let i = 0; i < surgeries.length; i += CONCURRENCY) {
        const batch = surgeries.slice(i, i + CONCURRENCY);
        
        const promises = batch.map(async (surgery) => {
            const metaDescription = await generateMetaDescription(surgery);
            if (metaDescription) {
                await prisma.surgery.update({
                    where: { id: surgery.id },
                    data: { metaDescription }
                });
                console.log(`[Success] ${surgery.name}: ${metaDescription}`);
            } else {
                console.log(`[Skipped] ${surgery.name} (Generation failed)`);
            }
        });

        await Promise.all(promises);
        processed += batch.length;
        console.log(`Progress: ${processed} / ${surgeries.length}`);
        
        // Anti rate-limit delay (free tier)
        await sleep(3000); 
    }

    console.log('Finished generating Meta Descriptions!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
