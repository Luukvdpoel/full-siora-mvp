import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getBrandForUser } from "@/lib/guards";
import { consumeCredits } from "@/lib/credits";
import { analyzeTextProfile, embed } from "@/lib/ai";
import { scoreMatch, oneIfEqual, softSetOverlap } from "@/lib/matchScore";
import { withErrorCapture } from "@/lib/sentry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  handle: string;
  niche: string | null;
  tone: string | null;
  values: string[] | null;
  followers: number;
  avgViews: number;
  engagement: number | null;
  location: string | null;
  dist: number; // pgvector distance
};

export const POST = withErrorCapture(async (req: Request) => {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { campaignId, topK = 20, minFollowers = 1000, maxFollowers = 2_000_000 } = await req.json();
  if (!campaignId) return new Response("campaignId required", { status: 400 });

  const brand = await getBrandForUser();
  if (!brand) return new Response("Brand not found", { status: 404 });

  // Load campaign
  const camp = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      title: true,
      brief: true,
      niche: true,
      targetTone: true,
      embedding: true,
      analyzedAt: true,
      desiredValues: true,
    },
  });
  if (!camp) return new Response("Campaign not found", { status: 404 });

  // If not analyzed → analyze (1 credit)
  if (!camp.embedding) {
    if (!camp.brief) return new Response("Campaign has no brief to analyze", { status: 400 });

    const debit = await consumeCredits(brand.id, 1, "AI_ANALYZE", `Auto: analyze campaign ${campaignId}`);
    if (!debit.ok) {
      return new Response(
        JSON.stringify({ error: "Not enough credits to analyze campaign" }),
        { status: 402 },
      );
    }

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

    // refresh
    const updated = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, niche: true, targetTone: true, embedding: true, desiredValues: true },
    });
    Object.assign(camp, updated);
  }

  if (!camp.embedding) return new Response("Failed to analyze campaign", { status: 500 });

  // Pull semantically similar creators (oversample, we re-rank)
  const rows: Row[] = await prisma.$queryRawUnsafe(
    `
    select
      c.id, c.name, c.handle, c.niche, c.tone, c.values, c."followers", c."avgViews", c."engagement", c."location",
      (c.embedding <=> $1) as dist
    from "Creator" c
    where c.embedding is not null
      and c."followers" between $2 and $3
    order by c.embedding <=> $1 asc
    limit $4
  `,
    camp.embedding,
    minFollowers,
    maxFollowers,
    Math.min(topK * 3, 200),
  );

  // Score
  const scored = rows.map((c) => {
    const semantic01 = 1 - Math.max(0, Math.min(1, c.dist)); // invert distance
    const toneMatch01 = oneIfEqual(c.tone, camp.targetTone);
    const nicheMatch01 = oneIfEqual(c.niche, camp.niche);
    const audienceFit01 = 1; // already filtered; refine if you pass an "ideal" range
    const engagement01 = Math.max(0, Math.min(1, (c.engagement ?? 0) / 10)); // cap at 10%
    const valuesOverlap = softSetOverlap(c.values || [], camp.desiredValues || []);
    const semanticBoosted = Math.min(1, semantic01 * (1 + 0.15 * valuesOverlap));

    const score = scoreMatch({
      semantic01: semanticBoosted,
      toneMatch01,
      nicheMatch01,
      audienceFit01,
      engagement01,
    });
    return { ...c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topK);

  // Charge credits: 1 per returned match
  const needed = top.length;
  if (needed > 0) {
    const debit = await consumeCredits(brand.id, needed, "AI_MATCH", `Auto: matches for ${campaignId} (${needed})`);
    if (!debit.ok) {
      return new Response(
        JSON.stringify({ error: `Not enough credits for ${needed} matches`, required: needed, remaining: debit.remaining }),
        { status: 402 },
      );
    }
  }

  // Upsert results
  await prisma.$transaction(
    top.map((m) =>
      prisma.match.upsert({
        where: { campaignId_creatorId: { campaignId, creatorId: m.id } },
        update: { matchScore: m.score, rationale: rationaleText(m, camp) },
        create: { campaignId, creatorId: m.id, matchScore: m.score, rationale: rationaleText(m, camp) },
      }),
    ),
  );

  if (process.env.POSTHOG_KEY) {
    await fetch("https://app.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.POSTHOG_KEY,
        event: "match_generated",
        properties: { campaignId, count: top.length },
      }),
    });
  }

  return Response.json({
    ok: true,
    analyzed: !camp.analyzedAt ? true : false, // rough signal
    count: top.length,
    data: top.map(({ dist, ...rest }) => rest),
  });
});

function rationaleText(c: Row, camp: any) {
  const bits = [];
  if (c.tone && camp.targetTone && c.tone === camp.targetTone) bits.push(`tone match: ${c.tone}`);
  if (c.niche && camp.niche && c.niche === camp.niche) bits.push(`niche: ${c.niche}`);
  if (Array.isArray(c.values) && Array.isArray(camp.desiredValues)) {
    const overlap = c.values.filter((v) => camp.desiredValues!.includes(v));
    if (overlap.length) bits.push(`values: ${overlap.join(", ")}`);
  }
  bits.push(`semantic fit via brief`);
  return bits.join(" · ");
}
