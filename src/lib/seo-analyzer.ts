import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const BRAND_VARIATIONS = ['healthexpress', 'health express', 'health xpress', 'healthexpress india'];

const MONEY_KEYWORDS = ['cost', 'price', 'hospital', 'doctor', 'surgeon', 'near me', 'mumbai', 'delhi', 'bangalore', 'pune', 'insurance', 'cashless', 'book', 'consultation'];

export function isBranded(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return BRAND_VARIATIONS.some(brand => lowerQuery.includes(brand));
}

// Ensure AI doesn't output prohibited claims
function sanitizeMedicalClaims(text: string): string {
    const blockedTerms = [/success rate/i, /100%/i, /guarantee/i, /best doctor/i, /cheapest/i, /massively increase/i];
    let sanitized = text;
    blockedTerms.forEach(term => {
        sanitized = sanitized.replace(term, '[MEDICAL_CLAIM_REMOVED]');
    });
    return sanitized;
}

export function calculateDeterministicScore(query: string, position: number, impressions: number, intent: string, revenueIntent: string): number {
    let score = 0;
    
    // Base score from impressions (max 20)
    score += Math.min(20, (impressions / 100));
    
    // Position multiplier (Positions 4-10 get the highest bump)
    if (position >= 4 && position <= 10) score += 30;
    else if (position >= 11 && position <= 20) score += 15;
    
    // Intent weighting
    if (intent === 'Transactional' || intent === 'Commercial Investigation') score += 20;
    if (intent === 'Local') score += 15;
    
    // Revenue intent weighting
    if (revenueIntent === 'Very High') score += 25;
    else if (revenueIntent === 'High') score += 15;
    
    // Money keyword exact match bonus
    const lowerQuery = query.toLowerCase();
    if (MONEY_KEYWORDS.some(k => lowerQuery.includes(k))) score += 10;
    
    return Math.min(100, Math.round(score));
}

export function determineOpportunityType(position: number, currentLandingPage: string | null): string {
    if (!currentLandingPage || currentLandingPage === '/' || currentLandingPage === 'https://healthexpressindia.com/') {
        return 'GAP';
    }
    if (position >= 1 && position <= 3) return 'TOP';
    if (position >= 4 && position <= 10) return 'NEAR_TOP';
    if (position >= 11 && position <= 20) return 'PAGE_2';
    if (position >= 21 && position <= 50) return 'GROWTH';
    return 'DISCOVERY';
}

export async function analyzeQueryIntent(query: string, position: number, impressions: number, currentLandingPage: string | null) {
    if (!process.env.GEMINI_API_KEY) {
        return generateMockAnalysis(query, position, currentLandingPage, impressions);
    }
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = "You are an expert SEO strategist for HealthExpress India, a surgical hospital chain.\n" +
            "Analyze this search query: " + query + "\n\n" +
            "Extract context for the CRM engine.\n" +
            "Return ONLY a JSON object (no markdown):\n" +
            "{\n" +
            "    \"intent\": \"Navigational | Informational | Commercial Investigation | Transactional | Local\",\n" +
            "    \"businessCapability\": \"Supported | Potential | Not Supported | Unknown\",\n" +
            "    \"revenueIntent\": \"Low | Medium | High | Very High\",\n" +
            "    \"recommendations\": {\n" +
            "        \"action\": \"expand | restructure | internal_links | new_page | canonicalize | differentiate\",\n" +
            "        \"title\": \"Suggested Title (No medical guarantees)\",\n" +
            "        \"h1\": \"Suggested H1\",\n" +
            "        \"contentSections\": [\"Section 1\", \"Section 2\"],\n" +
            "        \"internalLinks\": [\"Suggested URL path\"],\n" +
            "        \"supportingPages\": [\"Topic cluster page ideas\"],\n" +
            "        \"cta\": \"Suggested Call to Action\"\n" +
            "    }\n" +
            "}";
            
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        text = text.replace(/\\\json/g, '').replace(/\\\/g, '').trim();
        const parsed = JSON.parse(text);
        
        // Guardrails
        parsed.recommendations.title = sanitizeMedicalClaims(parsed.recommendations.title);
        parsed.recommendations.h1 = sanitizeMedicalClaims(parsed.recommendations.h1);
        
        // Deterministic Overrides
        parsed.type = determineOpportunityType(position, currentLandingPage);
        parsed.score = calculateDeterministicScore(query, position, impressions, parsed.intent, parsed.revenueIntent);
        
        return parsed;
    } catch (e) {
        console.error('Gemini SEO Analysis Error:', e);
        return generateMockAnalysis(query, position, currentLandingPage, impressions);
    }
}

function generateMockAnalysis(query: string, pos: number, url: string | null, impressions: number) {
    let intent = 'Informational';
    let revenueIntent = 'Low';
    
    if (query.includes('cost') || query.includes('surgeon')) {
        intent = 'Commercial Investigation';
        revenueIntent = 'High';
    }
    if (query.includes('hospital in')) {
        intent = 'Local';
        revenueIntent = 'Very High';
    }
    
    const type = determineOpportunityType(pos, url);
    const score = calculateDeterministicScore(query, pos, impressions, intent, revenueIntent);
    
    return {
        intent,
        businessCapability: 'Supported',
        revenueIntent,
        type,
        recommendations: {
            action: type === 'GAP' ? 'new_page' : 'expand',
            title: query + ' - HealthExpress (Mock)',
            h1: 'Overview of ' + query,
            contentSections: ['Overview', 'Pricing', 'FAQ'],
            internalLinks: ['/contact'],
            supportingPages: ['Cost Guide'],
            cta: 'Book Consultation'
        },
        score
    };
}
