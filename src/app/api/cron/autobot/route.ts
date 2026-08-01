import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Ensure the endpoint is dynamic and not cached
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // 1. Verify Authentication (Vercel Cron Secuirty)
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
        const randomSurgery = await prisma.surgery.findFirst({
            skip: skip,
        });

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
        const response = await result.response;
        const textContent = response.text();

        // 4. Save to Database to track history
        const postRecord = await prisma.socialPost.create({
            data: {
                content: textContent,
                platform: 'Pending-Platform', // We will update this when social APIs are integrated
                status: 'PUBLISHED_TEST',
                surgeryId: randomSurgery.id,
                publishedAt: new Date(),
            }
        });

        // 5. TODO: Push to actual Social Media APIs (Facebook, Instagram, etc)
        // We need the API keys from the user to implement this step.

        return NextResponse.json({ 
            success: true, 
            message: 'Autobot generated post successfully',
            surgery: randomSurgery.name,
            post: textContent,
            recordId: postRecord.id
        });

    } catch (error: any) {
        console.error('Autobot Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
