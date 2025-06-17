import type { PersonaProfile } from "@/types/persona";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface ImproveRequest {
  persona: PersonaProfile;
  rating: number;
  notes?: string;
}

interface FeedbackEntry {
  id: string;
  persona: PersonaProfile;
  rating: number;
  notes: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const { persona, rating, notes } = (await req.json()) as ImproveRequest;
    if (!persona || typeof persona !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid persona" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be 1-5" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const dbPath = path.join(process.cwd(), "..", "..", "db", "personaFeedback.json");
    let data: FeedbackEntry[] = [];
    try {
      const file = await fs.readFile(dbPath, "utf8");
      data = JSON.parse(file);
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }

    data.push({
      id: randomUUID(),
      persona,
      rating: numRating,
      notes: notes ?? "",
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    const messages = [
      {
        role: "system",
        content: [
          "You refine influencer personas based on user feedback.",
          "Respond ONLY with JSON matching the PersonaProfile TypeScript interface: { name: string; personality: string; interests: string[]; summary: string; postingFrequency?: string; toneConfidence?: number; brandFit?: string; growthSuggestions?: string }",
        ].join("\n"),
      },
      {
        role: "user",
        content: `Existing persona: ${JSON.stringify(persona)}\nRating: ${numRating}/5\nFeedback: ${notes ?? ""}`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: "gpt-4", messages, temperature: 0.7 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: errorText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const dataRes = await response.json();
    const content = dataRes.choices?.[0]?.message?.content ?? "{}";
    const improved: PersonaProfile = JSON.parse(content);

    return new Response(JSON.stringify(improved), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
