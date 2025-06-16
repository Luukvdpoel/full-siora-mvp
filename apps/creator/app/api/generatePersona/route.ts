export interface PersonaProfile {
  name: string;
  personality: string;
  interests: string[];
  summary: string;
}

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
          "You are a branding expert. Based on the following captions, infer a persona and respond ONLY with valid JSON using keys name, personality, interests and summary.",
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

    let persona: PersonaProfile;
    try {
      persona = JSON.parse(content) as PersonaProfile;
    } catch (e) {
      console.error("Failed to parse persona JSON", e);
      return new Response(
        JSON.stringify({ error: "Invalid response from OpenAI" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(persona), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
