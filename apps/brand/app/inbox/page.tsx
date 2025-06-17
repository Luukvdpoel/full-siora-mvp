"use client";

import { useState } from "react";
import { creators } from "@/app/data/creators";
import { useShortlist } from "@/lib/shortlist";
import { useBrandUser } from "@/lib/brandUser";
import SavedCreatorCard from "@/components/SavedCreatorCard";

export default function InboxPage() {
  const { user } = useBrandUser();
  const { ids } = useShortlist(user?.email ?? null);

  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("");
  const [minER, setMinER] = useState("");
  const [maxER, setMaxER] = useState("");

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

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400">No creators saved.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <SavedCreatorCard key={c.id} creator={c} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
