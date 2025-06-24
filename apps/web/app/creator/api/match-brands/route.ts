import type { BrandMatch } from "@/types/brandMatch";

export async function POST(req: Request) {
  try {
    const { vibe, audience, dreamBrands, goal } = await req.json();

    if (!vibe || !audience || !goal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content: [
          "You recommend ideal brand partners for influencers.",
          "Given the creator's vibe, audience, dream brands, and goal, suggest five brand names that align well.",
          "Include one short sentence for each brand explaining why it's a match based on tone, audience, or values.",
          "Respond ONLY with a JSON array of objects like: [{ name: string; reason: string }]"
        ].join("\n")
      },
      {
        role: "user",
        content: `Vibe: ${vibe}\nAudience: ${audience}\nDream brands: ${dreamBrands ?? ""}\nGoal: ${goal}`
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: "gpt-4", messages, temperature: 0.7 })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: errorText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";
    const matches: BrandMatch[] = JSON.parse(content);

    return new Response(JSON.stringify(matches), {
      status: 200,
      headers: { "Content-Type": "application/json" }
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
