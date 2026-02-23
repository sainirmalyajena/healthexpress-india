import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Uses Google Gemini to expand a search query (symptoms) into medical terms/surgeries.
 */
export async function getAISuggestedTerms(query: string): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('GEMINI_API_KEY is not configured for AI Search');
        return [];
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
Given a user query from a patient looking for medical surgery, extract or suggest 3-5 relevant medical terms, surgery names, or procedure names that match the intent or symptoms.
Return only the terms as a comma-separated list, nothing else.

Query: "${query}"
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Split by comma and clean up
        return text.split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
    } catch (error) {
        console.error('AI Search Expansion Error:', error);
        return [];
    }
}

/**
 * Heuristic to detect if a query is "natural language" (likely symptoms) 
 * rather than a simple surgery name.
 */
export function isLikelySymptomatic(query: string): boolean {
    const normalized = query.toLowerCase().trim();
    // Common symptom related words
    const symptomKeywords = ['pain', 'ache', 'feeling', 'since', 'broken', 'blood', 'swelling', 'i have', 'my ', 'stomach', 'chest', 'leg', 'arm', 'head'];

    const wordCount = normalized.split(/\s+/).length;

    // If it's more than 2 words OR contains a symptom keyword
    return wordCount > 2 || symptomKeywords.some(kw => normalized.includes(kw));
}
