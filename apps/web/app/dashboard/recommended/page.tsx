import { creators, type Creator } from "@/app/data/creators";
import type { BrandProfile, CreatorPersona } from "shared-utils";
import { getFitScore } from "shared-utils";

export const dynamic = "force-static";

export default function RecommendedPage() {
  const brand: BrandProfile = {
    targetAgeRange: { min: 18, max: 30 },
    niches: ["Beauty & Lifestyle"],
    tone: "Warm & Aspirational",
    values: ["wellness", "selfcare"],
    desiredFormats: ["UGC reels"],
    categories: ["Clean beauty"],
  };

  const scored = creators.map((c: Creator) => {
    const persona: CreatorPersona = {
      niches: [c.niche],
      tone: c.tone,
      platforms: [c.platform],
      vibe: c.tags?.join(" "),
    };
    const { score, reason } = getFitScore(persona, brand);
    return { creator: c, score, reason };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5);

  return (
    <main className="min-h-screen bg-gradient-radial from-siora-dark via-siora-mid to-siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Recommended Creators</h1>
        <p className="text-zinc-400">
          Based on your brand profile, these creators have the highest fit
          scores.
        </p>
        <div className="space-y-4">
          {top.map(({ creator, score, reason }) => (
            <div
              key={creator.id}
              className="bg-siora-mid border border-siora-border rounded-xl p-6 shadow-siora-hover"
            >
              <h2 className="text-xl font-semibold">
                {creator.name}{" "}
                <span className="text-siora-accent">@{creator.handle.replace(/^@/, "")}</span>
              </h2>
              <p className="text-sm text-zinc-400 mb-2">
                Fit Score: {score}/100
              </p>
              <p className="text-sm text-zinc-300">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
