import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Ensure the endpoint is dynamic and not cached
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // 1. Verify Authentication (Vercel Cron Security)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Select a Random Surgery
        const surgeriesCount = await prisma.surgery.count();
        if (surgeriesCount === 0) {
            return NextResponse.json({ message: 'No surgeries found in the database.' }, { status: 400 });
        }
        const skip = Math.floor(Math.random() * surgeriesCount);
        const randomSurgery = await prisma.surgery.findFirst({ skip });

        if (!randomSurgery) {
            return NextResponse.json({ message: 'Failed to pick a surgery.' }, { status: 500 });
        }

        // 3. Generate Content using Google Gemini AI
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: 'GEMINI_API_KEY not configured.' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Write an engaging, educational social media post about the medical procedure: "${randomSurgery.name}".
Category: ${randomSurgery.category}
Overview: ${randomSurgery.overview.substring(0, 300)}...

Guidelines:
- Make it professional but accessible to patients in India.
- Highlight the benefits of getting this surgery done.
- Include 3-5 relevant hashtags (e.g., #HealthExpressIndia #Surgery).
- End with a call-to-action to visit our website (healthexpressindia.com) for a free estimate.
- Do NOT use any emojis that might seem unprofessional. Keep it clean.
- Length: Around 3-4 short paragraphs.
        `;

        const result = await model.generateContent(prompt);
        const textContent = await result.response.text();
        const imageUrl = "https://healthexpressindia.com/images/home/hero-surgeon.png";

        let fbSuccess = false;
        let igSuccess = false;
        let apiErrors = [];

        // 4. Publish to Facebook Page
        if (process.env.FACEBOOK_PAGE_ID && process.env.META_ACCESS_TOKEN) {
            try {
                const fbRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}/feed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: textContent,
                        link: `https://healthexpressindia.com/en/surgeries/${randomSurgery.slug}`,
                        access_token: process.env.META_ACCESS_TOKEN
                    })
                });
                const fbData = await fbRes.json();
                if (fbData.error) throw new Error(fbData.error.message);
                fbSuccess = true;
            } catch (err: any) {
                apiErrors.push(`FB Error: ${err.message}`);
            }
        } else {
            apiErrors.push('Missing FACEBOOK_PAGE_ID or META_ACCESS_TOKEN');
        }

        // 5. Publish to Instagram
        if (process.env.INSTAGRAM_ACCOUNT_ID && process.env.META_ACCESS_TOKEN) {
            try {
                // Step 5a: Create Container
                const igContainerRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_url: imageUrl,
                        caption: textContent,
                        access_token: process.env.META_ACCESS_TOKEN
                    })
                });
                const containerData = await igContainerRes.json();
                if (containerData.error) throw new Error(containerData.error.message);

                // Step 5b: Publish Container
                const igPublishRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        creation_id: containerData.id,
                        access_token: process.env.META_ACCESS_TOKEN
                    })
                });
                const publishData = await igPublishRes.json();
                if (publishData.error) throw new Error(publishData.error.message);
                igSuccess = true;
            } catch (err: any) {
                apiErrors.push(`IG Error: ${err.message}`);
            }
        } else {
            apiErrors.push('Missing INSTAGRAM_ACCOUNT_ID');
        }

        // 6. Save to Database to track history
        const status = (fbSuccess || igSuccess) ? 'PUBLISHED' : 'FAILED';
        const postRecord = await prisma.socialPost.create({
            data: {
                content: textContent,
                platform: fbSuccess && igSuccess ? 'Facebook, Instagram' : (fbSuccess ? 'Facebook' : (igSuccess ? 'Instagram' : 'None')),
                status: status,
                surgeryId: randomSurgery.id,
                publishedAt: new Date(),
                errorMessage: apiErrors.join(' | ') || null
            }
        });

        return NextResponse.json({ 
            success: fbSuccess || igSuccess, 
            message: 'Autobot completed execution',
            surgery: randomSurgery.name,
            recordId: postRecord.id,
            fbSuccess,
            igSuccess,
            errors: apiErrors
        });

    } catch (error: any) {
        console.error('Autobot Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
