import type { PitchResult } from "@/types/pitch";

export async function POST(req: Request) {
  try {
    const { persona, values } = await req.json();

    if (!persona || typeof persona !== "object") {
      return new Response(
        JSON.stringify({ error: "Persona data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!values || (typeof values !== "string" && !Array.isArray(values))) {
      return new Response(
        JSON.stringify({ error: "Brand values are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const valuesStr = Array.isArray(values) ? values.join(", ") : values;

    const messages = [
      {
        role: "system",
        content: [
          "You craft short outreach pitches for brands to invite creators to collaborate.",
          "Given the creator persona and brand values, explain briefly why the creator aligns with those values and then provide a short email pitch.",
          "Respond ONLY with JSON that matches this TypeScript interface:",
          "{ reasoning: string; pitch: string }",
        ].join(" \n"),
      },
      {
        role: "user",
        content: `Persona: ${JSON.stringify(persona)}\nBrand values: ${valuesStr}`,
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
