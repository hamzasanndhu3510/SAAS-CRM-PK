
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
    Your task is to analyze a new lead from the Pakistani market and prepare a high-standard outreach package.

    CRITICAL EMAIL FORMATTING RULES:
    1. Structure: [Formal Salutation], [Professional Opening], [Value-Driven Body], [Clear Call to Action], [Professional Sign-off].
    2. Tone: ${leadData.tone}.
    3. Context: Adjust for a ${leadData.category} lead.
    4. Salutation: Use "Dear [Name]," or "Assalam-o-Alaikum [Name]," depending on the business context.
    5. Signature: Include a professional placeholder for ${leadData.tenant_name}.
    6. Language: Professional English, but localized nuances for the Pakistani business hub (${leadData.city}).

    ANALYSIS RULES:
    - Initial Probability: How likely are they to sign based ONLY on current info?
    - Post-Reply Probability: If they reply to this specific email, how high does their intent jump?

    Return ONLY JSON with keys: email_subject, email_body, probability, post_reply_probability, strategy.
  `;

  const prompt = `
    Lead: ${leadData.first_name} ${leadData.last_name}
    City: ${leadData.city}
    Deal Value: PKR ${leadData.value}
    Category: ${leadData.category}
    Context: ${leadData.description}
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
      email_subject: data.email_subject || `Inquiry from ${leadData.tenant_name}`,
      email_body: data.email_body || "",
      probability: data.probability || 35,
      post_reply_probability: data.post_reply_probability || 65,
      strategy: data.strategy || "Standard follow-up."
    };
  } catch (e) {
    console.error("AI Outreach Generation Error", e);
    return {
        email_subject: `Regarding your interest in ${leadData.tenant_name}`,
        email_body: `Dear ${leadData.first_name},\n\nThank you for reaching out. We are currently reviewing your requirements in ${leadData.city} and would love to discuss how we can assist you.\n\nBest regards,\nThe ${leadData.tenant_name} Team`,
        probability: 20,
        post_reply_probability: 50,
        strategy: "Manual outreach required."
    };
  }
}

export async function structureLeadsFromCSV(csvContent: string, tenantId: string, assignedTo: string): Promise<Partial<Contact>[]> {
  const systemInstruction = `Structure CSV lead data into JSON array of Contact objects.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: csvContent,
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    const parsed = JSON.parse(response.text || '[]');
    return parsed.map((item: any) => ({ ...item, id: Math.random().toString(36).substr(2, 9), tenant_id: tenantId, assigned_to: assignedTo, created_at: new Date().toISOString() }));
  } catch (e) { return []; }
}

export async function performFullLeadAnalysis(contact: Contact, opportunity: Opportunity): Promise<AIAnalysis> {
  const systemInstruction = `Analyze lead for purchase intent. Output JSON: score, sentiment, summary, strategy, intent_markers.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contact: ${contact.first_name}. Description: ${contact.description}.`,
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    return { ...JSON.parse(response.text || '{}'), last_analyzed: new Date().toISOString() };
  } catch (error) {
    return { score: 50, sentiment: 'neutral', summary: 'Analysis pending.', strategy: 'Follow up.', intent_markers: [], last_analyzed: new Date().toISOString() };
  }
}
