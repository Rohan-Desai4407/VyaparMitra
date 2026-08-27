import { config } from "./env.js";

export const callGeminiApi = async (prompt: string, systemInstruction?: string) => {
  if (!config.geminiApiKey) {
    console.warn("[Gemini API] GEMINI_API_KEY not set. Using intelligent fallback response.");
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemInstruction ? systemInstruction + "\n\n" : ""}${prompt}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("[Gemini API Error]:", error);
    return null;
  }
};
