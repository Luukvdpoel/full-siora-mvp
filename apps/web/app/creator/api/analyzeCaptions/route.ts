import type { CaptionAnalysis } from "@creator/types/captionAnalysis";

export async function POST(req: Request) {
  try {
    const { captions } = await req.json();

    if (!Array.isArray(captions) || !captions.every((c) => typeof c === "string")) {
      return new Response(
        JSON.stringify({ error: "Invalid input: captions must be an array of strings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content: [
          "You analyze Instagram captions for branding insights.",
          "Return ONLY JSON matching this TypeScript interface:",
          "{ dominantTones: string[]; recurringThemes: string[]; personaTraits: string[]; strategyTips: string[] }",
          "Determine dominant tone(s), recurring themes, persona traits (style, values, niche indicators), and give 2-3 tailored content strategy tips."
        ].join("\n"),
      },
      { role: "user", content: captions.join("\n") },
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
    const analysis: CaptionAnalysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
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
