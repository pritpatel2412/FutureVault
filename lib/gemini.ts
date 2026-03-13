import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function moderateIdea(title: string, domain: string, solution: string): Promise<{ approved: boolean; reason: string }> {
  if (!ai) {
    console.warn("No GEMINI_API_KEY, auto-approving.");
    return { approved: true, reason: "No API key" };
  }

  const prompt = `You are a content moderator for a startup ideas platform.
Analyze the following idea submission and return strict JSON:
{"approved": boolean, "reason": "string"}

Reject if: hate speech, adult content, spam, completely nonsensical, or not related to a startup/business idea.
Approve if: it's a genuine startup concept, even if unusual or ambitious.

Idea: ${title} | Domain: ${domain} | Description: ${solution}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt]
    });

    const text = response.text || "{}";
    
    // Attempt to extract JSON
    const jsonStr = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
    const result = JSON.parse(jsonStr);

    return {
      approved: result.approved === true,
      reason: result.reason || "Default reason"
    };
  } catch (error) {
    console.error("Gemini moderation error:", error);
    // Auto-approve if the model errors out so the app still works for the demo
    return { approved: true, reason: "Error in moderation API" };
  }
}
