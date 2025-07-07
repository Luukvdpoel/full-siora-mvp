export async function POST(req: Request) {
  try {
    const {
      creatorHandle,
      deliverables,
      timeline,
      payment,
      platform,
      usageRights,
    } = await req.json();

    if (
      !creatorHandle ||
      !deliverables ||
      !timeline ||
      !payment ||
      !platform ||
      !usageRights
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = [
      "You are an expert brand deal copywriter and legal assistant.",
      "Generate a short but clear influencer contract based on:",
      "- Deliverables",
      "- Platform(s)",
      "- Timeline",
      "- Payment terms",
      "- Usage rights",
      "",
      "The tone should be friendly but professional. Format cleanly. Avoid unnecessary legal jargon but include essential clauses.",
    ].join("\n");

    const userPrompt = [
      `Creator handle: ${creatorHandle}`,
      `Deliverables: ${deliverables}`,
      `Timeline: ${timeline}`,
      `Payment: ${payment}`,
      `Platform: ${platform}`,
      `Usage Rights: ${usageRights}`,
    ].join("\n");

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
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
        { status: response.status, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const contract = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ contract }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
