export async function POST(req: Request) {
  try {
    const { captions } = await req.json();

    if (!captions || !Array.isArray(captions)) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid input: expected captions as an array of strings.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `
You are a branding expert. Based on the Instagram captions below, infer a persona for the creator.

Respond ONLY with valid JSON in the following structure:
{
  "name": string,
  "personality": string,
  "interests": string[],
  "summary": string
}

Captions:
${captions.join("\n")}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: error }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    return new Response(content, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
