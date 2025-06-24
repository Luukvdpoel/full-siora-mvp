export async function POST(req: Request) {
  try {
    const {
      name,
      goals,
      productInfo,
      idealCreators,
      budget,
      campaignFocus,
      targetAudience,
    } = await req.json();

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ error: "Brand name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const details = [
      `Name: ${name}`,
      goals ? `Goals: ${goals}` : undefined,
      productInfo ? `Product: ${productInfo}` : undefined,
      budget ? `Budget: ${budget}` : undefined,
      campaignFocus ? `Campaign focus: ${campaignFocus}` : undefined,
      targetAudience ? `Target audience: ${targetAudience}` : undefined,
      idealCreators ? `Ideal creators: ${idealCreators}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const messages = [
      {
        role: "system",
        content: [
          "You assist brands in preparing influencer outreach.",
          "Craft a concise mission blurb, list three short creator-fit traits, recommend the best platform and content formats, and write a short outreach pitch.",
          "Respond ONLY with JSON matching this TypeScript interface:",
          "{ mission: string; creatorTraits: string[]; platformFormat: string; pitch: string }",
        ].join("\n"),
      },
      { role: "user", content: details },
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
    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
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
