import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeTextProfile, embed } from "@/lib/ai";
import { getBrandForUser } from "@/lib/guards";
import { consumeCredits } from "@/lib/credits";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { creatorId } = await req.json();
    if (!creatorId) return new Response("creatorId required", { status: 400 });

    const brand = await getBrandForUser();
    if (!brand) return new Response("Brand not found", { status: 404 });

    const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", `Analyze creator ${creatorId}`);
    if (!debit.ok) return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 402 });

    const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
    if (!creator?.bio) return new Response("Creator has no bio", { status: 400 });

    const { tone, values, keywords } = await analyzeTextProfile(creator.bio);
    const vec = await embed([
      creator.name,
      creator.handle,
      creator.bio,
      (creator.tags || []).join(" "),
      (values || []).join(" "),
    ].join("\n"));

    await prisma.$executeRawUnsafe(
      `update "Creator" set "tone" = $1, "values" = $2, "keywords" = $3, "analysisAt" = now(), embedding = $4 where id = $5`,
      tone,
      values,
      keywords,
      JSON.stringify(vec),
      creatorId,
    );

    return Response.json({ ok: true, tone, values, keywords, remaining: debit.remaining });
  } catch (err) {
    Sentry.captureException(err);
    return new Response("Internal error", { status: 500 });
  }
}
