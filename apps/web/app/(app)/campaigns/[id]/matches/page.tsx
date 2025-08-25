import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import MatchesClient from "./MatchesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MatchesPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return null; // protected by middleware

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      brief: true,
      niche: true,
      targetTone: true,
      analyzedAt: true,
      brand: { select: { id: true, plan: true, credits: true } },
      matches: {
        orderBy: { matchScore: "desc" },
        select: {
          matchScore: true,
          rationale: true,
          creator: {
            select: {
              id: true,
              name: true,
              handle: true,
              niche: true,
              tone: true,
              values: true,
              followers: true,
              avgViews: true,
              engagement: true,
              location: true,
            },
          },
        },
      },
    },
  });

  if (!campaign) {
    return <div className="p-8">Campaign not found.</div>;
  }

  return (
    <Suspense fallback={<div className="p-8 text-white/60">Loading…</div>}>
      <MatchesClient
        campaign={{
          id: campaign.id,
          title: campaign.title,
          brief: campaign.brief ?? "",
          niche: campaign.niche ?? "",
          targetTone: campaign.targetTone ?? "",
          analyzedAt: campaign.analyzedAt?.toISOString() ?? null,
          credits: campaign.brand.credits ?? 0,
          plan: campaign.brand.plan,
        }}
        initialMatches={campaign.matches.map((m) => ({
          score: m.matchScore,
          rationale: m.rationale ?? "",
          ...m.creator,
        }))}
      />
    </Suspense>
  );
}
