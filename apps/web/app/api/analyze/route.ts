import { requirePro, getBrandForUser } from "@/lib/guards";
import { consumeCredits } from "@/lib/credits";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { withRetry } from "@/lib/retry";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const brand = await getBrandForUser();
    if (!brand) return new Response("Brand not found", { status: 404 });

    // const pro = await requirePro();
    // if (!pro) return new Response("Pro required", { status: 402 });

    const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", "Analyze creator bio");
    if (!debit.ok) {
      return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 402 });
    }

    const { bio } = await req.json();
    const res = await withRetry(() =>
      client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Analyze tone and values for: ${bio}` }],
      }),
    );

    return Response.json({ analysis: res.choices[0]?.message?.content ?? "", remaining: debit.remaining });
  } catch (err) {
    Sentry.captureException(err);
    return new Response("Internal error", { status: 500 });
  }
}
