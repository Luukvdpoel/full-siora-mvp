import { callOpenAI, safeJson } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { captions, tone, audience, platform } = await req.json();

    // Validate that captions is an array of strings
    if (!Array.isArray(captions) || !captions.every((c) => typeof c === "string")) {
      return new Response(
        JSON.stringify({ error: "Invalid input: captions must be an array of strings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          "You are an influencer coach analyzing creator content to craft a concise persona.",
          "Use the tone, audience and platform hints when provided to refine your analysis.",
          "Return ONLY JSON that matches the PersonaProfile interface (name, personality, interests, summary).",
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          'Captions: Just posted my new recipe! #vegan #health',
          'Tone hint: upbeat',
          'Audience: foodies',
          'Platform: Instagram',
        ].join('\n'),
      },
      {
        role: 'assistant',
        content:
          '{"name":"HealthyFoodie","personality":"energetic","interests":["cooking"],"summary":"Shares vibrant vegan recipes"}',
      },
      {
        role: 'user',
        content: [
          captions.join('\n'),
          tone ? `Tone hint: ${tone}` : undefined,
          audience ? `Audience: ${audience}` : undefined,
          platform ? `Platform: ${platform}` : undefined,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const parsed = safeJson(content, {});

    return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
