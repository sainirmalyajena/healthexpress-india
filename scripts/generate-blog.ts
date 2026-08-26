import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY is not defined in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function generateBlogPost(topic: string) {
    console.log(`🤖 Generating blog post for topic: "${topic}"...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `
You are an expert medical writer and SEO specialist for HealthExpress India, a medical tourism and surgery aggregator in India. 
Write a highly structured, SEO-optimized, and medically accurate blog post about: "${topic}".

Your output must be RAW valid MDX format with gray-matter frontmatter at the top. Do not wrap in markdown code blocks.
Include these frontmatter fields:
- title: (Catchy, SEO friendly title)
- date: (Today's date in YYYY-MM-DD format)
- excerpt: (A compelling 2-sentence summary)
- author: "HealthExpress Medical Team"
- category: (e.g., "Surgery", "Eye Care", "Orthopedics")
- image: "/blog-1.jpg"

Content Requirements:
- Use clear H2 and H3 headings.
- Include a bulleted list of benefits or risks if applicable.
- Make it empathetic and reassuring to patients.
- Include a Call to Action (CTA) at the end encouraging them to book a free consultation with HealthExpress India.
- Format beautifully using standard Markdown.
- STRICT RULE: DO NOT invent, hallucinate, or reference specific real-world doctor names. If you must refer to doctors, use terms like "Board-Certified Specialists" or "HealthExpress Orthopedic Surgeons".
- STRICT RULE: At the very bottom of the article, add a small disclaimer in italics: "*Disclaimer: The costs mentioned are estimates and may vary based on hospital choice, graft type, room category, and the patient's specific medical condition. Please consult with our medical team for a personalized quote.*"

Output ONLY the MDX file content, starting with --- and ending with the final paragraph.
`;

    try {
        const result = await model.generateContent(prompt);
        let content = result.response.text();
        
        // Clean up markdown block wrapping if Gemini adds it
        if (content.startsWith('\`\`\`mdx')) {
            content = content.replace(/^\`\`\`mdx\n/, '').replace(/\n\`\`\`$/, '');
        } else if (content.startsWith('\`\`\`markdown')) {
            content = content.replace(/^\`\`\`markdown\n/, '').replace(/\n\`\`\`$/, '');
        } else if (content.startsWith('\`\`\`')) {
            content = content.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
        }

        // Generate slug from topic
        const slug = topic
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.mdx`);
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Successfully generated and saved to: ${filePath}`);
    } catch (error) {
        console.error('❌ Error generating content:', error);
    }
}

const topicArgs = process.argv.slice(2);
if (topicArgs.length === 0) {
    console.error('❌ Please provide a topic. Example: npx tsx scripts/generate-blog.ts "Cost of ACL Surgery in Delhi"');
    process.exit(1);
}

const topic = topicArgs.join(' ');
generateBlogPost(topic);
