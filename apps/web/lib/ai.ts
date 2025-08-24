import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Extract tone, values, and keywords from free text
export async function analyzeTextProfile(text: string) {
  const sys = `You extract a creator or campaign profile from text.
Return JSON with:
- tone: one of ["Playful","Serious","Bold","Aspirational","Educational"]
- values: up to 5 short value words (e.g., Sustainability, Transparency)
- keywords: up to 12 lowercase keywords (no spaces if possible; use hyphens)`;

  const user = `TEXT:\n${text}\n\nReturn ONLY JSON.`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    temperature: 0.2,
  });

  const raw = chat.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return {
    tone: parsed.tone ?? null,
    values: Array.isArray(parsed.values) ? parsed.values.slice(0, 5) : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 12) : [],
  };
}

// Create 1536-dim embedding
export async function embed(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });
  return res.data[0].embedding; // number[]
}

// Cosine to 0..1 similarity (client-side, if needed)
export function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}
