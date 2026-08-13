import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const lang = formData.get("lang") as string || "en";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString("base64");

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        };

        const languageInstruction = lang === 'hi' 
            ? "Respond in professional Hindi. Translate all medical terms to easy-to-understand Hindi."
            : "Respond in clear, professional English.";

        const prompt = `
You are a highly experienced, empathetic medical triage AI for HealthExpress India. 
Analyze the provided medical report, prescription, or diagnostic image. 

Your job is to translate complex medical jargon into a simple, easy-to-understand summary for the patient, and identify if any specific surgery is typically associated with these findings.

${languageInstruction}

IMPORTANT: You MUST respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or code blocks:
{
  "diagnosisSummary": "A very simple, compassionate 2-3 sentence explanation of what the report indicates.",
  "medicalTermsExplained": ["term1: simple definition", "term2: simple definition"],
  "recommendedSurgery": "The name of the likely surgery required (e.g. 'Cataract Surgery', 'Gallbladder Removal', 'Knee Replacement'). If no surgery is obvious, put 'Consultation Needed'.",
  "urgency": "High", // "High", "Medium", or "Low"
  "nextSteps": "What the patient should do next (e.g., 'Consult an orthopedic surgeon to confirm the MRI findings.')"
}
`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();
        
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        try {
            const jsonResponse = JSON.parse(text);
            return NextResponse.json(jsonResponse);
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", text);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

    } catch (error) {
        console.error("AI Triage Error:", error);
        return NextResponse.json({ error: "Internal server error during analysis" }, { status: 500 });
    }
}
