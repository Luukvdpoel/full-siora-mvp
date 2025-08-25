import React from 'react';
import { creators, type Creator } from "@/app/data/creators";
import { advancedMatch, type AdvancedBrand, type AdvancedCreator } from "@/lib/matching/advancedMatcher";

export const dynamic = "force-static";

export default async function RecommendedPage() {
  const brand: AdvancedBrand = {
    values: ["wellness", "selfcare"],
    tone: "Warm & Aspirational",
    campaignType: "long-term",
    brief: "Seeking authentic creators to showcase our clean beauty line to Gen Z audiences."
  };

  const scored = await Promise.all(
    creators.map(async (c: Creator) => {
      const persona: AdvancedCreator = {
        values: c.tags,
        tone: c.tone,
        successRate: Math.min((c.completedCollabs ?? 0) / 10, 1),
        personaText: c.summary,
      };
      const { score, reasons } = await advancedMatch(persona, brand);
      return { creator: c, score, reasons };
    })
  );

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5);

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Recommended Creators</h1>
        <p className="text-zinc-400">
          Based on your brand profile, these creators have the highest fit
          scores.
        </p>
        <div className="space-y-4">
          {top.map(({ creator, score, reasons }) => (
            <div
              key={creator.id}
              className="bg-Siora-mid border border-Siora-border rounded-xl p-6 shadow-Siora-hover"
            >
              <h2 className="text-xl font-semibold">
                {creator.name}{" "}
                <span className="text-Siora-accent">@{creator.handle.replace(/^@/, "")}</span>
              </h2>
              <p className="text-sm text-zinc-400 mb-2">
                Fit Score: {score}/100
              </p>
              {reasons.length > 0 && (
                <ul className="text-sm text-zinc-300 list-disc list-inside">
                  {reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
