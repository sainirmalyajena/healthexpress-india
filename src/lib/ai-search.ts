import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Uses Google Gemini to expand a search query (symptoms) into medical terms/surgeries.
 */
export async function getAISuggestedTerms(query: string): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('AI Search: Missing API Key');
        return [];
    }

    console.log('AI Search: Triggered for query:', query);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        let model;
        try {
            model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        } catch (e) {
            console.warn('AI Search: Failed to initialize 2.0-flash, trying 1.5-flash');
            model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }

        const prompt = `
Given a user query from a patient looking for medical surgery, extract or suggest 3-5 relevant medical terms, surgery names, or procedure names that match the intent or symptoms.
Return only the terms as a comma-separated list, nothing else.

Query: "${query}"
`;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (e: any) {
            console.error('AI Search: Gemini 2.0-flash fail, trying 1.5-flash fallback:', e.message);
            const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            result = await fallbackModel.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text().trim();
        console.log('AI Search suggested terms:', text);

        // Split by comma and clean up
        return text.split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
    } catch (error: any) {
        console.error('AI Search Expansion Critical Error:', {
            errorMessage: error.message,
            stack: error.stack
        });
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
