import type { PitchResult } from "@creator/types/pitch";

export async function POST(req: Request) {
  try {
    const { persona, brand } = await req.json();
    if (!brand || typeof brand !== "object" || !brand.name) {
      return new Response(
        JSON.stringify({ error: "Brand data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!persona || typeof persona !== "object") {
      return new Response(
        JSON.stringify({ error: "Persona data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content: [
          "You craft short outreach pitches for creators to approach brands.",
          "Given the creator persona and brand campaign focus, explain briefly why the collaboration fits and provide a copy-paste pitch email.",
          "Respond ONLY with JSON matching this TypeScript interface:",
          "{ reasoning: string; pitch: string }",
        ].join(" \n"),
      },
      {
        role: "user",
        content: `Persona: ${JSON.stringify(persona)}\nBrand: ${JSON.stringify(brand)}`,
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
    const pitch: PitchResult = JSON.parse(content);

    return new Response(JSON.stringify(pitch), {
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
