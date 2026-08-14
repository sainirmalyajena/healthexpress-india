import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        // Fallback demo mode if API key is not configured
        console.warn("Gemini API key not found. Returning mock analysis for demonstration.");
        
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResponse = {
            diagnosisSummary: "The uploaded report shows mild degenerative changes in the right knee joint with Grade 1 cartilage wear. The bone structure is intact with no fractures or ligament tears. This is a very common, age-related change that responds well to non-surgical treatment.",
            medicalTermsExplained: [
                "Degenerative changes: Normal wear-and-tear of the joint that happens with age.",
                "Grade 1 cartilage wear: The earliest stage of cartilage thinning — still very manageable.",
                "Osteophytes: Tiny bone spurs that can form around aging joints. Often painless."
            ],
            recommendedSurgery: "Not Required at This Stage",
            urgency: "Low",
            surgicalNecessity: "NOT_RECOMMENDED",
            alternativeTreatments: [
                "Physiotherapy: Targeted exercises to strengthen the muscles around the knee, reducing pain by up to 60%.",
                "Weight Management: Even 5 kg of weight loss significantly reduces pressure on knee joints.",
                "Anti-inflammatory Medication: A short course of prescribed NSAIDs can control inflammation effectively.",
                "Hot/Cold Therapy: Applying heat packs in the morning and ice packs after activity reduces stiffness and swelling."
            ],
            nextSteps: "Based on this report, surgery is not necessary at this stage. We strongly recommend starting physiotherapy and lifestyle modifications first. Book a free consultation with our medical expert to get a personalized non-surgical recovery plan."
        };
        
        return NextResponse.json(mockResponse);
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
You are a highly experienced, empathetic, and BRUTALLY HONEST medical triage AI for HealthExpress India.

Your PRIMARY ethical obligation is to PROTECT the patient from unnecessary surgery. You must NEVER recommend surgery unless the medical evidence clearly indicates it is the only viable treatment path. 

Analyze the provided image thoroughly.

EVALUATION FRAMEWORK:
0. CRITICAL: First, determine if the uploaded image is ACTUALLY a medical report, prescription, scan, or diagnostic document. If it is NOT (e.g., a screenshot of a website, a random photo, a blank page), set "isMedicalDocument" to false and provide a simple error in "diagnosisSummary".
1. If it IS a medical document, read every finding in the report carefully.
2. Determine if the condition can be managed through NON-SURGICAL treatments (medication, physiotherapy, lifestyle changes, monitoring).
3. ONLY recommend surgery if the clinical evidence unambiguously points to it (e.g., complete ligament tear, advanced-stage cancer, retinal detachment, acute appendicitis, etc.).
4. If you are uncertain, always err on the side of "CONSULTATION_NEEDED" — never push surgery.

${languageInstruction}

IMPORTANT: You MUST respond ONLY with a valid JSON object matching this exact schema, with no markdown formatting or code blocks:
{
  "isMedicalDocument": boolean, // true if the image is a valid medical document, false otherwise
  "diagnosisSummary": "A very simple, compassionate 2-3 sentence explanation of what the report indicates. Be reassuring when appropriate.",
  "medicalTermsExplained": ["term1: simple definition", "term2: simple definition"],
  "recommendedSurgery": "The name of the likely surgery required (e.g. 'Cataract Surgery'). If surgery is NOT needed, put 'Not Required at This Stage'. If uncertain, put 'Consultation Needed'.",
  "urgency": "High | Medium | Low",
  "surgicalNecessity": "NOT_RECOMMENDED | CONSULTATION_NEEDED | HIGHLY_LIKELY",
  "alternativeTreatments": ["treatment1: brief explanation of how it helps", "treatment2: brief explanation"],
  "nextSteps": "What the patient should do next. If surgery is not needed, emphasize non-surgical recovery path and reassure the patient."
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
                    { error: lang === 'hi' ? "अपलोड की गई छवि कोई वैध चिकित्सा रिपोर्ट या नुस्खा नहीं लगती है। कृपया स्पष्ट तस्वीर अपलोड करें।" : "The uploaded image does not appear to be a valid medical report or prescription. Please upload a clear picture of your medical document." },
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
        return NextResponse.json({ error: "Internal server error during analysis" }, { status: 500 });
    }
}
