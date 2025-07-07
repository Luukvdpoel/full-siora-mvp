import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@creator/lib/auth";

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

    const {
      handle,
      vibe,
      goal,
      audience,
      contentPreference,
      platform,
      struggles,
      dreamBrands,
      favFormats,
    } = await req.json();

    if (
      !handle ||
      !vibe ||
      !goal ||
      !audience ||
      !contentPreference ||
      !platform
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const rawData = {
      handle,
      vibe,
      goal,
      audience,
      niche: contentPreference,
      platform,
      struggles,
      dreamBrands,
      favFormats,
    };

    const extractMessages = [
      {
        role: "system",
        content: [
          "Standardize the creator's answers. Return ONLY JSON in this format:",
          "{ handle: string; vibe: string; goal: string; audience: string; niche: string; platform: string; struggles?: string; dreamBrands?: string; favFormats?: string }",
        ].join("\n"),
      },
      { role: "user", content: JSON.stringify(rawData) },
    ];

    const extractRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: extractMessages,
          temperature: 0,
        }),
      },
    );

    if (!extractRes.ok) {
      const errorText = await extractRes.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: errorText }),
        {
          status: extractRes.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const extractData = await extractRes.json();
    const cleaned = JSON.parse(
      extractData.choices?.[0]?.message?.content ?? "{}",
    );

    const personaMessages = [
      {
        role: "system",
        content: [
          "You are a branding expert who crafts short creator persona bios in Markdown.",
          "Use the structured data provided to write 2-3 concise paragraphs about the creator's style and goals.",
        ].join("\n"),
      },
      { role: "user", content: JSON.stringify(cleaned) },
    ];

    const personaRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: personaMessages,
          temperature: 0.7,
        }),
      },
    );

    if (!personaRes.ok) {
      const errorText = await personaRes.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: errorText }),
        {
          status: personaRes.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const personaData = await personaRes.json();
    const content = personaData.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ result: content }), {
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
