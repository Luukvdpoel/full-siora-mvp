import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getBrandForUser } from "@/lib/guards";
import { consumeCredits } from "@/lib/credits";
import OpenAI from "openai";
import * as Sentry from "@sentry/nextjs";
import { withRetry } from "@/lib/retry";

export const runtime = "nodejs";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });
    const brand = await getBrandForUser();
    if (!brand) return new Response("Brand not found", { status: 404 });

    const { creatorId, campaignId, deliverables, rights, priceEUR, notes } = await req.json();

    const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", "Deal evaluation");
    if (!debit.ok) return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 402 });

    const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
    const brief = campaignId ? (await prisma.campaign.findUnique({ where: { id: campaignId } }))?.brief : null;

    const prompt = `Assess a proposed influencer deal for fairness, risks, and suggestions.
Creator followers: ${creator?.followers}, ER: ${creator?.engagement ?? "n/a"}%
Deliverables: ${deliverables}
Usage rights: ${rights || "unspecified"}
Price (EUR): ${priceEUR}
Campaign brief: ${brief ?? "—"}
Return JSON: { "fairnessScore": 0-100, "risks": "…", "suggestion": "…" }`;

    const res = await withRetry(() =>
      ai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    );

    const j = JSON.parse(res.choices[0]?.message?.content || "{}");
    const saved = await prisma.dealEval.create({
      data: {
        brandId: brand.id,
        creatorId,
        campaignId,
        deliverables,
        rights,
        priceEUR,
        notes,
        fairnessScore: j.fairnessScore ?? null,
        risks: j.risks ?? null,
        suggestion: j.suggestion ?? null,
      },
    });

    return Response.json(saved);
  } catch (err) {
    Sentry.captureException(err);
    return new Response("Internal error", { status: 500 });
  }
}
