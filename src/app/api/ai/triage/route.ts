import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("CRITICAL: Gemini API key not found in environment variables.");
        const envKeys = Object.keys(process.env).filter(k => k.includes('GEMINI'));
        return NextResponse.json({ 
            error: `System Configuration Error: AI capabilities are currently offline. Please ensure GEMINI_API_KEY is set in your Vercel Environment Variables. Found keys: ${envKeys.join(', ')}` 
        }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const lang = formData.get("lang") as string || "en";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

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
You are a highly experienced, empathetic, and BRUTALLY HONEST medical triage AI for HealthExpress India.

Your PRIMARY ethical obligation is to PROTECT the patient from unnecessary surgery. You must NEVER recommend surgery unless the medical evidence clearly indicates it is the only viable treatment path. 

Analyze the provided image thoroughly.

EVALUATION FRAMEWORK:
0. CRITICAL: First, determine if the uploaded image is ACTUALLY a medical report, prescription, lab test, scan, or diagnostic document. 
   - If it is a picture of a person, a selfie, a website screenshot, a random object, or anything else: set "isMedicalDocument" to false.
   - If it is NOT a medical document, DO NOT hallucinate a diagnosis. You MUST set "isMedicalDocument" to false.
1. If it IS a medical document, read every finding in the report carefully.
2. Determine if the condition can be managed through NON-SURGICAL treatments (medication, physiotherapy, lifestyle changes, monitoring).
3. ONLY recommend surgery if the clinical evidence unambiguously points to it (e.g., complete ligament tear, advanced-stage cancer, retinal detachment, acute appendicitis, etc.).
4. If you are uncertain, always err on the side of "CONSULTATION_NEEDED" — never push surgery.

${languageInstruction}

IMPORTANT: You MUST respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or code blocks:
{
  "isMedicalDocument": boolean, // MUST be false if the image is a person, selfie, random object, or not a medical document.
  "diagnosisSummary": "If isMedicalDocument is false, leave empty. Otherwise, a simple 2-3 sentence explanation.",
  "medicalTermsExplained": ["term1: simple definition"],
  "recommendedSurgery": "If isMedicalDocument is false, leave empty. Otherwise, name of surgery or 'Not Required at This Stage'.",
  "urgency": "High | Medium | Low",
  "surgicalNecessity": "NOT_RECOMMENDED | CONSULTATION_NEEDED | HIGHLY_LIKELY",
  "alternativeTreatments": ["treatment1: brief explanation"],
  "nextSteps": "What the patient should do next."
}

RULES FOR "surgicalNecessity":
- "NOT_RECOMMENDED": The report shows conditions manageable without surgery. List alternative treatments.
- "CONSULTATION_NEEDED": The report is ambiguous or shows early-stage issues that need specialist evaluation before deciding.
- "HIGHLY_LIKELY": The report clearly shows a condition where surgery is the standard-of-care treatment (e.g., mature cataract, complete ACL tear, gallstones with acute cholecystitis).

RULES FOR "alternativeTreatments":
- ALWAYS provide at least 2-3 alternatives, even for surgical cases (e.g., pre-surgery strengthening, post-surgery rehab).
- For non-surgical cases, provide 3-5 detailed, actionable alternatives with brief explanations of efficacy.
`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();
        
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        try {
            const jsonResponse = JSON.parse(text);
            
            // Protect against non-medical images (hallucination prevention)
            if (jsonResponse.isMedicalDocument === false) {
                return NextResponse.json(
                    { error: lang === 'hi' ? "अपलोड की गई छवि कोई वैध चिकित्सा रिपोर्ट या नुस्खा नहीं लगती है। कृपया अपनी वास्तविक रिपोर्ट की स्पष्ट तस्वीर अपलोड करें।" : "The uploaded image does not appear to be a valid medical report or prescription. Please upload a clear picture of your actual medical document." },
                    { status: 400 }
                );
            }
            
            // Ensure the new fields exist with safe defaults
            if (!jsonResponse.surgicalNecessity) {
                jsonResponse.surgicalNecessity = jsonResponse.recommendedSurgery === 'Not Required at This Stage' 
                    ? 'NOT_RECOMMENDED' 
                    : 'CONSULTATION_NEEDED';
            }
            if (!jsonResponse.alternativeTreatments) {
                jsonResponse.alternativeTreatments = [];
            }
            
            return NextResponse.json(jsonResponse);
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", text);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

    } catch (error) {
        console.error("AI Triage Error:", error);
        return NextResponse.json({ error: "Internal server error during analysis: " + (error.message || "") }, { status: 500 });
    }
}
