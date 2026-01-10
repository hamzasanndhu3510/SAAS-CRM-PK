
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Opportunity, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Lead Funnel Architect
 * Analyzes lead data to suggest the most accurate funnel position.
 */
export async function suggestLeadFunnelStage(data: {
  description: string,
  value: number,
  tenant_name: string
}): Promise<{ suggested_stage: string, reasoning: string }> {
  const systemInstruction = `
    You are a Sales Strategy Architect for ${data.tenant_name}.
    Analyze the lead description (HTML) and deal value to suggest a stage.
    STAGES:
    - 'lead': Initial inquiry, vague interest, basic questions.
    - 'contacted': Specific requirements discussed, meetings requested.
    - 'qualified': Budget confirmed, decision maker involved, high value.
    - 'closed': Final payment details requested, invoice sent, verbal agreement.

    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Description: ${data.description}, Value: ${data.value}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggested_stage: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"suggested_stage": "lead", "reasoning": "Default fallback"}');
  } catch (e) {
    return { suggested_stage: 'lead', reasoning: 'AI offline' };
  }
}

/**
 * AI Inbox Triage Agent
 * Decides if AI can answer or if a human is needed.
 */
export async function processChatTriage(payload: {
  messages: any[],
  tenant_name: string,
  contact_name: string
}): Promise<{ reply: string, human_needed: boolean }> {
  const systemInstruction = `
    You are the Front-Desk AI for ${payload.tenant_name}.
    Respond to ${payload.contact_name}.
    
    RULES:
    1. Answer basic FAQs about business hours, general services, and greetings.
    2. If the user asks about specific pricing, technical complaints, or complex requests, 
       politely say you are connecting them to a specialist and set human_needed to true.
    3. Keep replies professional, short, and helpful.
    
    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Conversation History: ${JSON.stringify(payload.messages)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            human_needed: { type: Type.BOOLEAN }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"reply": "I am processing your request.", "human_needed": true}');
  } catch (e) {
    return { reply: "Let me check with our team.", human_needed: true };
  }
}

export async function batchProcessLeads(
  rows: any[], 
  tenantName: string
): Promise<Partial<Contact>[]> {
  const systemInstruction = `
    You are a Data Architect for ${tenantName}. 
    Analyze raw spreadsheet row chunks and map them to our CRM structure with high precision.
    
    FUZZY MAPPING DICTIONARY:
    - first_name: Detect columns like "Name", "Customer", "Full Name", "Client", "Buyer", "Sarf".
    - phone: Detect "Mobile", "WhatsApp", "Contact", "Ph#", "Cell", "Mob", "P". Normalise for Pakistan (03XXXXXXXXX).
    - email: Detect columns with "@" or "Email Address".
    - city: Detect "Address", "City", "Location", "Hub", "Regional", "Shehar".
    - description: Merge context from "Notes", "Inquiry", "Interest", "Requirement".

    STRICT RULES:
    1. Phone number is the PRIMARY key. If not found or invalid, skip the row.
    2. Names must be converted to Proper Case (e.g., "ahmed ali" -> "Ahmed Ali").
    3. Return ONLY a valid JSON array of objects.
    4. Categorize as "individual" unless company keywords are detected in the name or description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Process this batch of raw row data: ${JSON.stringify(rows)}`,
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
    console.error("Neural Batch Processing Failed", e);
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
