
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Opportunity, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Lead Outreach Package
 * Generates a high-standard professional email and predictive closing metrics.
 */
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
    Your task is to analyze a new lead from the Pakistani market and prepare a strictly professional outreach package.

    CRITICAL EMAIL FORMATTING RULES:
    1. Structure: [Formal Salutation], [Professional Opening], [Value-Driven Body], [Clear Call to Action], [Professional Sign-off].
    2. Tone: ${leadData.tone}.
    3. Context: Adjust for a ${leadData.category} lead.
    4. Language: Use professional English. If appropriate, include a polite "Assalam-o-Alaikum" in the opening.
    5. No placeholders: Generate a complete draft that can be sent immediately after minor review.
    6. Signature: Include a professional placeholder for ${leadData.tenant_name}.

    ANALYSIS RULES:
    - Initial Probability: Score 0-100 based on lead description and deal value.
    - Post-Reply Probability: Predictive score if the lead engages with this specific email.

    Return ONLY JSON with keys: email_subject, email_body, probability, post_reply_probability, strategy.
  `;

  const prompt = `
    Lead Profile:
    - Name: ${leadData.first_name} ${leadData.last_name}
    - Location: ${leadData.city}
    - Category: ${leadData.category}
    - Estimated Deal Value: PKR ${leadData.value}
    - Description of Needs: ${leadData.description}
    - Desired Tone: ${leadData.tone}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
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

    const data = JSON.parse(response.text || '{}');
    return {
      email_subject: data.email_subject || `Business Proposal from ${leadData.tenant_name}`,
      email_body: data.email_body || "",
      probability: data.probability || 35,
      post_reply_probability: data.post_reply_probability || 65,
      strategy: data.strategy || "Standard professional follow-up."
    };
  } catch (e) {
    console.error("AI Outreach Generation Error", e);
    return {
        email_subject: `Regarding your inquiry - ${leadData.tenant_name}`,
        email_body: `Dear ${leadData.first_name},\n\nThank you for reaching out. We are currently reviewing your requirements and would love to discuss how we can assist you.\n\nBest regards,\nThe ${leadData.tenant_name} Team`,
        probability: 25,
        post_reply_probability: 50,
        strategy: "Manual outreach required."
    };
  }
}

/**
 * AI Vision: Payment Screenshot Verification
 * Optimized for JazzCash, EasyPaisa, and Pakistani Bank Apps.
 * Fix: Use gemini-3-flash-preview for multimodal tasks requiring JSON response.
 */
export async function verifyPaymentScreenshot(base64Image: string): Promise<{ is_valid: boolean, txn_id: string, amount: number, confidence: number }> {
  const systemInstruction = `
    You are a Financial Audit AI for a Pakistani CRM. 
    Analyze the provided screenshot (JazzCash, EasyPaisa, or Banking App).
    1. Identify the Transaction ID (Txn ID).
    2. Identify the Amount Paid.
    3. Determine if it looks like a valid successful confirmation screen.
    Return JSON only: { is_valid: boolean, txn_id: string, amount: number, confidence: number }.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Analyze this payment screenshot for validity." },
          { inlineData: { mimeType: "image/png", data: base64Image } }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN },
            txn_id: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER }
          },
          required: ['is_valid', 'txn_id', 'amount', 'confidence']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Payment Verification Failed", e);
    return { is_valid: false, txn_id: "", amount: 0, confidence: 0 };
  }
}

/**
 * Localized Re-engagement Logic
 */
export async function generateRomanUrduNudge(leadName: string, context: string): Promise<string> {
  const systemInstruction = `
    Generate a short, polite, professional Roman Urdu/English mix (Hinglish/Urlish) follow-up message.
    The tone should be localized for the Pakistani market (respectful but direct).
    Example: "Assalam-o-Alaikum [Name], umeed hai aap khairiyat se hongay. Just following up on..."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Lead Name: ${leadName}. Context: ${context}`,
      config: { systemInstruction }
    });
    return response.text || "";
  } catch (e) {
    return `Assalam-o-Alaikum ${leadName}, following up on our last discussion. Hope to hear from you soon!`;
  }
}

/**
 * Full lead analysis with responseSchema for reliability.
 */
export async function performFullLeadAnalysis(contact: Contact, opportunity: Opportunity): Promise<AIAnalysis> {
  const systemInstruction = `Analyze lead for purchase intent. Output JSON: score, sentiment, summary, strategy, intent_markers.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contact: ${contact.first_name}. Description: ${contact.description}.`,
      config: { 
        systemInstruction, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            summary: { type: Type.STRING },
            strategy: { type: Type.STRING },
            intent_markers: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'sentiment', 'summary', 'strategy', 'intent_markers']
        }
      }
    });
    return { ...JSON.parse(response.text || '{}'), last_analyzed: new Date().toISOString() };
  } catch (error) {
    return { score: 50, sentiment: 'neutral', summary: 'Analysis pending.', strategy: 'Follow up.', intent_markers: [], last_analyzed: new Date().toISOString() };
  }
}
