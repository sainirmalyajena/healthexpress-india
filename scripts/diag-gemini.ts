import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const apiKey = "AIzaSyCxG36dXWEJkj_aD1wHeQl-McxOZregwIY";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("test");
        console.log("Success with gemini-1.5-flash");
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available Models:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to list models:", e.message);
    }
}

listModels();
