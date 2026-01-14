
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
          },
          required: ['suggested_stage', 'reasoning']
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
          },
          required: ['reply', 'human_needed']
        }
      }
    });
    return JSON.parse(response.text || '{"reply": "I am processing your request.", "human_needed": true}');
  } catch (e) {
    return { reply: "Let me check with our team.", human_needed: true };
  }
}

/**
 * AI Lead Sentiment & Scoring Engine
 * Analyzes a specific message to determine lead heat.
 */
export async function analyzeLeadMessage(text: string, tenantName: string): Promise<AIAnalysis> {
  const systemInstruction = `
    You are a Lead Psychology Expert at ${tenantName}.
    Analyze the incoming message from a lead.
    Determine:
    1. Score (0-100): 100 is "ready to buy now", 0 is "completely uninterested/spam".
    2. Sentiment: positive, neutral, or negative.
    3. Strategy: A short recommendation for the sales agent.
    4. Summary: A very brief summary of the message.
    5. Intent Markers: Array of specific topics or signals.
    
    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            strategy: { type: Type.STRING },
            summary: { type: Type.STRING },
            intent_markers: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'sentiment', 'strategy', 'summary', 'intent_markers']
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    return {
      score: result.score || 50,
      sentiment: (result.sentiment as any) || 'neutral',
      strategy: result.strategy || 'Continue standard follow-up',
      summary: result.summary || 'User message received',
      intent_markers: result.intent_markers || [],
      last_analyzed: new Date().toISOString()
    };
  } catch (e) {
    return {
      score: 50,
      sentiment: 'neutral',
      strategy: 'Manual follow-up required',
      summary: 'Analysis unavailable',
      intent_markers: [],
      last_analyzed: new Date().toISOString()
    };
  }
}

/**
 * AI Outreach Packager
 * Generates personalized outreach emails.
 */
export async function generateOutreachPackage(data: {
  first_name: string,
  last_name: string,
  description: string,
  value: number,
  tone: string,
  tenant_name: string
}): Promise<{ email_subject: string, email_body: string }> {
  const systemInstruction = `
    You are a Sales Copywriter for ${data.tenant_name}.
    Generate a personalized outreach email for ${data.first_name} ${data.last_name}.
    Context: ${data.description}.
    Deal Value: PKR ${data.value}.
    Tone: ${data.tone}.
    Return ONLY JSON with 'email_subject' and 'email_body'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate the email.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email_subject: { type: Type.STRING },
            email_body: { type: Type.STRING }
          },
          required: ['email_subject', 'email_body']
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    return {
      email_subject: result.email_subject || 'Following up on your inquiry',
      email_body: result.email_body || 'Hello, I would like to discuss your requirements further.'
    };
  } catch (e) {
    return {
      email_subject: "Following up on your inquiry",
      email_body: "Hello, I would like to discuss your requirements further."
    };
  }
}

/**
 * AI Lead Batch Mapper
 * Maps raw spreadsheet data to structured lead profiles.
 */
export async function batchProcessLeads(chunk: any[], tenantName: string): Promise<any[]> {
  const systemInstruction = `
    You are a Data Processing AI for ${tenantName}.
    Convert these raw objects from a spreadsheet into clean lead profiles.
    Map fields to: first_name, last_name, email, phone, city, description, lead_category (one of: smb, corporate, individual).
    Return ONLY JSON as an array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(chunk),
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
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              city: { type: Type.STRING },
              description: { type: Type.STRING },
              lead_category: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
}
