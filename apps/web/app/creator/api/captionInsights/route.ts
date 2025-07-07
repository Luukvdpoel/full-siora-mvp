import type { CaptionInsightsResponse } from "@creator/types/insights";

export async function POST(req: Request) {
  try {
    const { captions } = await req.json();

    if (
      !Array.isArray(captions) ||
      captions.length < 3 ||
      captions.length > 10 ||
      !captions.every((c) => typeof c === "string")
    ) {
      return new Response(
        JSON.stringify({ error: "Provide 3-10 caption strings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content: [
          "You analyze Instagram captions to understand a creator's style.",
          "Return a short summary plus a JSON table describing tone, content type, and common themes for each caption.",
          "Respond ONLY with JSON matching this TypeScript interface:",
          "{ summary: string; insights: { caption: string; tone: string; contentType: string; themes: string[]; }[] }",
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
    const analysis: CaptionInsightsResponse = JSON.parse(content);

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
