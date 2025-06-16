import type { PersonaProfile } from "@/types/persona";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

const DAILY_LIMIT = 3;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const used = await prisma.persona.count({
      where: { userId: session.user.id, createdAt: { gte: start } },
    });
    if (used >= DAILY_LIMIT) {
      return new Response(JSON.stringify({ error: "limit" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

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
          "You are a branding expert. Given 3–5 social media captions, infer a creator’s persona in the following JSON format:",
          "{",
          "  name: string,",
          "  personality: string,",
          "  interests: string[],",
          "  summary: string",
          "}",
          "Only return valid JSON.",
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
    const persona: PersonaProfile = JSON.parse(content);

    return new Response(JSON.stringify(persona), {
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
