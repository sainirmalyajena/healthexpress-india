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
        const prompt = "You are an expert SEO strategist for HealthExpress India, a surgical hospital chain.\n" +
            "Analyze this search query: " + query + "\n" +
            "Current position: " + position + "\n" +
            "Impressions: " + impressions + "\n" +
            "Current Landing Page: " + (currentLandingPage || 'None') + "\n\n" +
            "Classify the query into one of these intents: 'Informational', 'Commercial Investigation', 'Transactional', 'Local'.\n" +
            "Then, determine the opportunity type:\n" +
            "- QUICK_WIN: if position is between 4 and 20.\n" +
            "- GROWTH: if position is between 21 and 50.\n" +
            "- GAP: if there is no dedicated page (or landing page is just the homepage /).\n" +
            "- CANNIBALIZATION: if multiple pages compete.\n\n" +
            "Return ONLY a JSON object (no markdown, no code blocks):\n" +
            "{\n" +
            "    \"intent\": \"...\",\n" +
            "    \"type\": \"QUICK_WIN\",\n" +
            "    \"recommendations\": {\n" +
            "        \"title\": \"Suggested SEO Title\",\n" +
            "        \"h1\": \"Suggested H1\",\n" +
            "        \"action\": \"expand | restructure | internal_links | new_page\",\n" +
            "        \"supportingContent\": \"Brief description of content to add\"\n" +
            "    },\n" +
            "    \"score\": 85\n" +
            "}";
            
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
            title: query + ' - HealthExpress',
            h1: 'Everything about ' + query,
            action: type === 'GAP' ? 'new_page' : 'expand',
            supportingContent: 'Add FAQ schema and pricing tables.'
        },
        score: Math.floor(Math.random() * 50) + 50
    };
}
