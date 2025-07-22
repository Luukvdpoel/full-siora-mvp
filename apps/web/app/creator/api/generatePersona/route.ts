import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { captions } = await req.json();

    // Validate that captions is an array of strings
    if (!Array.isArray(captions) || !captions.every((c) => typeof c === "string")) {
      return new Response(
        JSON.stringify({ error: "Invalid input: captions must be an array of strings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content:
          [
            "You are a branding expert helping analyze a creator's content.",
            "Review the captions provided and identify the overall tone, recurring themes, and values expressed.",
            "Infer what type of creator they are and highlight their strengths.",
            "Respond ONLY with valid JSON that matches the PersonaProfile interface (name, personality, interests, summary).",
          ].join(" "),
      },
      { role: "user", content: captions.join("\n") },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });

    return new Response(content, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
