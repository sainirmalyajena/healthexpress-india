import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const BRAND_VARIATIONS = ['healthexpress', 'health express', 'health xpress', 'healthexpress india'];

export function isBranded(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return BRAND_VARIATIONS.some(brand => lowerQuery.includes(brand));
}

export async function analyzeQueryIntent(query: string, position: number, impressions: number, currentLandingPage: string | null) {
    if (!process.env.GEMINI_API_KEY) {
        return generateMockAnalysis(query, position, currentLandingPage);
    }
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = \
You are an expert SEO strategist for HealthExpress India, a surgical hospital chain.
Analyze this search query: "\"
Current position: \
Impressions: \
Current Landing Page: \

Classify the query into one of these intents: "Informational", "Commercial Investigation", "Transactional", "Local".
Then, determine the opportunity type:
- QUICK_WIN: if position is between 4 and 20.
- GROWTH: if position is between 21 and 50.
- GAP: if there is no dedicated page (or landing page is just the homepage /).
- CANNIBALIZATION: if multiple pages compete (you won't know this directly from one query, but leave open).

Return ONLY a JSON object (no markdown, no code blocks):
{
    "intent": "...",
    "type": "QUICK_WIN" | "GROWTH" | "GAP" | "CANNIBALIZATION",
    "recommendations": {
        "title": "Suggested SEO Title",
        "h1": "Suggested H1",
        "action": "expand | restructure | internal_links | new_page",
        "supportingContent": "Brief description of content to add"
    },
    "score": 0-100 (Prioritize high commercial intent and healthcare relevance)
}
\;
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        text = text.replace(/\\\json/g, '').replace(/\\\/g, '').trim();
        return JSON.parse(text);
    } catch (e) {
        console.error('Gemini SEO Analysis Error:', e);
        return generateMockAnalysis(query, position, currentLandingPage);
    }
}

function generateMockAnalysis(query: string, pos: number, url: string | null) {
    let type = 'QUICK_WIN';
    if (pos > 20) type = 'GROWTH';
    if (!url || url === 'https://healthexpressindia.com/') type = 'GAP';

    let intent = 'Informational';
    if (query.includes('cost') || query.includes('surgeon')) intent = 'Commercial Investigation';
    if (query.includes('hospital in')) intent = 'Local';
    
    return {
        intent,
        type,
        recommendations: {
            title: \\ - HealthExpress\,
            h1: \Everything about \\,
            action: type === 'GAP' ? 'new_page' : 'expand',
            supportingContent: 'Add FAQ schema and pricing tables.'
        },
        score: Math.floor(Math.random() * 50) + 50
    };
}
