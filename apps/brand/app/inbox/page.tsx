"use client";

import { useState, useMemo, useEffect } from "react";
import { creators } from "@/app/data/creators";
import { useShortlist } from "@/lib/shortlist";
import { useBrandUser } from "@/lib/brandUser";
import SavedCreatorCard from "@/components/SavedCreatorCard";
import type { BrandProfile, CreatorPersona } from "shared-utils";
import { matchScore } from "shared-utils";

export default function InboxPage() {
  const { user } = useBrandUser();
  const { ids } = useShortlist(user?.email ?? null);

  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("");
  const [minER, setMinER] = useState("");
  const [maxER, setMaxER] = useState("");

  const [brand, setBrand] = useState<BrandProfile & { platforms?: string[] } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("brandPrefs");
    if (stored) {
      try {
        setBrand(JSON.parse(stored));
      } catch {
        setBrand(null);
      }
    } else {
      setBrand({
        targetAgeRange: { min: 18, max: 30 },
        niches: ["Beauty & Lifestyle"],
        tone: "Warm & Aspirational",
        values: ["wellness", "selfcare"],
        desiredFormats: ["UGC reels"],
        categories: ["Clean beauty"],
        platforms: ["Instagram"],
      });
    }
  }, []);

  const savedCreators = creators.filter((c) => ids.includes(c.id));

  const niches = Array.from(new Set(savedCreators.map((c) => c.niche)));
  const vibes = Array.from(new Set(savedCreators.map((c) => c.vibe).filter(Boolean)));

  const filtered = savedCreators.filter((c) => {
    const nicheOk = niche ? c.niche === niche : true;
    const vibeOk = vibe ? c.vibe === vibe : true;
    const minOk = minER ? c.engagementRate >= parseFloat(minER) : true;
    const maxOk = maxER ? c.engagementRate <= parseFloat(maxER) : true;
    return nicheOk && vibeOk && minOk && maxOk;
  });

  const scored = useMemo(() => {
    return filtered
      .map((c) => {
        const persona: CreatorPersona = {
          niches: [c.niche],
          tone: c.tone,
          platforms: [c.platform],
          vibe: c.vibe,
          formats: c.formats,
        };
        let score = 0;
        let reason = '';
        if (brand) {
          const result = matchScore(persona, brand);
          score = result.score;
          reason = result.reasons.slice(0, 3).join(', ');
        }
        return { creator: c, score, reason };
      })
      .sort((a, b) => b.score - a.score);
  }, [filtered, brand]);

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Inbox</h1>

        <div className="bg-Siora-mid p-4 rounded-xl shadow-Siora-hover space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
            >
              <option value="">All</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Vibe</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
            >
              <option value="">All</option>
              {vibes.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Min ER%</label>
            <input
              type="number"
              step="0.1"
              value={minER}
              onChange={(e) => setMinER(e.target.value)}
              placeholder="Any"
              className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Max ER%</label>
            <input
              type="number"
              step="0.1"
              value={maxER}
              onChange={(e) => setMaxER(e.target.value)}
              placeholder="Any"
              className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
            />
          </div>
        </div>

        {scored.length === 0 ? (
          <p className="text-center text-zinc-400">No creators saved.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scored.map(({ creator, score, reason }) => (
              <SavedCreatorCard
                key={creator.id}
                creator={creator}
                score={Math.round(score)}
                reason={reason}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
