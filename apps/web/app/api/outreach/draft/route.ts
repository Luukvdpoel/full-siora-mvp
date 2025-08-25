import { currentUser, auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { consumeCredits } from "@/lib/credits";
import OpenAI from "openai";

export const runtime = "nodejs";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { userId } = auth(); if (!userId) return new Response("Unauthorized", { status: 401 });
  const { creatorId, campaignId, tone = "friendly" } = await req.json();

  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress;
  if (!email) return new Response("Unauthorized", { status: 401 });
  const brand = await prisma.brand.findFirst({ where: { owner: { email } } });
  if (!brand) return new Response("Brand not found", { status: 404 });

  const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", "Outreach draft");
  if (!debit.ok) return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 402 });

  const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
  const camp = campaignId ? await prisma.campaign.findUnique({ where: { id: campaignId } }) : null;

  const prompt = `Write a concise ${tone} first-contact email to creator ${creator?.name} (${creator?.handle}) for a brand campaign.
Brand: ${brand.name}
Campaign: ${camp?.title ?? "—"}
Brief: ${camp?.brief ?? "—"}
Keep under 120 words. End with one clear call-to-action.`;

  const res = await ai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const body = res.choices[0]?.message?.content?.trim() ?? "";
  const draft = await prisma.outreach.create({
    data: { brandId: brand.id, creatorId, campaignId, channel: "email", subject: camp?.title ?? "Collaboration", body, status: "draft" },
  });

  return Response.json({ id: draft.id, subject: draft.subject, body });
}
