import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function optimizeContent() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY is not set');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('--- Fetching Content ---');
    const surgeries = await prisma.surgery.findMany();
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

    console.log(`Found ${surgeries.length} surgeries and ${blogFiles.length} blog posts.\n`);

    // 1. Optimize Blog Posts
    for (const file of blogFiles) {
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: text } = matter(content);

        console.log(`Optimizing Blog: ${data.title}...`);

        const prompt = `
        Analyze the following blog post title and content. 
        1. Suggest a high-impact SEO meta description (max 160 chars).
        2. Identify which of these surgeries are relevant to the content: ${surgeries.map(s => s.name).join(', ')}.
        3. Suggest a natural place to insert a link to the relevant surgery page.

        Title: ${data.title}
        Content: ${text.substring(0, 1000)}...

        Response format: YAML only.
        meta_description: "..."
        suggested_links:
          - surgery_name: "..."
            reason: "..."
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(response.text());
        console.log('---');
    }

    // 2. Optimize Surgeries (Cost/SEO)
    for (const surgery of surgeries) {
        console.log(`Optimizing Surgery: ${surgery.name}...`);

        const prompt = `
        Analyze the surgery "${surgery.name}" with overview: "${surgery.overview}".
        Suggest a highly optimized SEO meta description and 3 relevant keywords.

        Response format: JSON only.
        {
            "meta_description": "...",
            "keywords": ["...", "...", "..."]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(response.text());
        console.log('---');
    }

    await prisma.$disconnect();
}

optimizeContent().catch(console.error);
