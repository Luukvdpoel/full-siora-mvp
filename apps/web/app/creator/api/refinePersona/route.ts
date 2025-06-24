import type { PersonaProfile } from "@/types/persona";

export async function POST(req: Request) {
  try {
    const { persona, updates } = await req.json();

    if (!persona || typeof persona !== "object" || typeof updates !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content: [
          "You refine influencer personas.",
          "Given the existing persona and new creator information, rewrite the persona using the same structure.",
          "Respond ONLY with JSON matching the PersonaProfile TypeScript interface: { name: string; personality: string; interests: string[]; summary: string; postingFrequency?: string; toneConfidence?: number; brandFit?: string; growthSuggestions?: string }"
        ].join("\n"),
      },
      {
        role: "user",
        content: `Existing persona: ${JSON.stringify(persona)}\nNew data: ${updates}`,
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const refined: PersonaProfile = JSON.parse(content);

    return new Response(JSON.stringify(refined), {
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
