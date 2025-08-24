import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeTextProfile, embed } from "@/lib/ai";
import { getBrandForUser } from "@/lib/guards";
import { consumeCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { campaignId } = await req.json();
  if (!campaignId) return new Response("campaignId required", { status: 400 });

  const brand = await getBrandForUser();
  if (!brand) return new Response("Brand not found", { status: 404 });

  const camp = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!camp?.brief) return new Response("Campaign has no brief", { status: 400 });

  const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", `Analyze campaign ${campaignId}`);
  if (!debit.ok) return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 402 });

  const { tone, values, keywords } = await analyzeTextProfile(camp.brief);
  const vec = await embed([camp.title, camp.brief, (values || []).join(" ")].join("\n"));

  await prisma.$executeRawUnsafe(
    `update "Campaign" set "targetTone" = $1, "desiredValues" = $2, "desiredKeywords" = $3, "analyzedAt" = now(), embedding = $4 where id = $5`,
    tone,
    values,
    keywords,
    JSON.stringify(vec),
    campaignId,
  );

  return Response.json({ ok: true, tone, values, keywords });
}
