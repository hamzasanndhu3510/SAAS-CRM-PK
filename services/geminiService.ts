
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Opportunity, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Batch Spreadsheet Processor
 * Maps raw row data to structured leads in bulk.
 */
export async function batchProcessLeads(
  rows: any[], 
  tenantName: string
): Promise<Partial<Contact>[]> {
  const systemInstruction = `
    You are a Data Engineering AI for ${tenantName}. 
    Analyze the provided raw spreadsheet data and map them to our CRM Lead structure.
    
    REQUIRED MAPPING:
    - first_name: (Identify name or separate first name)
    - last_name: (Identify surname)
    - phone: (Identify mobile number, format for Pakistan e.g. 03XX XXXXXXX)
    - email: (Identify valid email address)
    - city: (Identify city or hub)
    - lead_category: (One of: corporate, smb, individual)
    - description: (Combine other relevant columns like inquiry or notes)

    RULES:
    1. If a phone is missing, ignore that row.
    2. Normalize all data (proper casing for names).
    3. Return ONLY a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Raw Data Chunks: ${JSON.stringify(rows)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              first_name: { type: Type.STRING },
              last_name: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              city: { type: Type.STRING },
              lead_category: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("AI Batch Processing Error", e);
    return [];
  }
}

export async function generateOutreachPackage(leadData: { 
    first_name: string, 
    last_name: string, 
    city: string, 
    value: number,
    description: string,
    category: string,
    tone: string,
    tenant_name: string 
}): Promise<{ email_body: string, email_subject: string, probability: number, post_reply_probability: number, strategy: string }> {
  const systemInstruction = `
    You are a Senior Business Development Director at ${leadData.tenant_name}. 
    Generate a professional email and predictive analysis for a lead.
    Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Lead: ${JSON.stringify(leadData)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email_subject: { type: Type.STRING },
            email_body: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            post_reply_probability: { type: Type.NUMBER },
            strategy: { type: Type.STRING }
          },
          required: ['email_subject', 'email_body', 'probability', 'post_reply_probability', 'strategy']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
        email_subject: `Regarding your inquiry - ${leadData.tenant_name}`,
        email_body: "",
        probability: 25,
        post_reply_probability: 50,
        strategy: "Manual follow up."
    };
  }
}

export async function verifyPaymentScreenshot(base64Image: string): Promise<{ is_valid: boolean, txn_id: string, amount: number, confidence: number }> {
  const systemInstruction = `Financial Audit AI. Analyze payment screenshot for Txn ID, Amount, Validity. Return JSON only.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: "Verify this." }, { inlineData: { mimeType: "image/png", data: base64Image } }] },
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { is_valid: false, txn_id: "", amount: 0, confidence: 0 };
  }
}
