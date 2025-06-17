"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import creators from "@/app/data/creators";
import SavedCreatorCard from "@/components/SavedCreatorCard";
import { useBrandUser } from "@/lib/brandUser";
import { useShortlist } from "@/lib/shortlist";

export default function InboxPage() {
  const { user } = useBrandUser();
  const router = useRouter();
  const { ids } = useShortlist(user?.email ?? null);

  const [niche, setNiche] = useState("");
  const [minER, setMinER] = useState("");
  const [vibe, setVibe] = useState("");

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) return null;

  const niches = Array.from(new Set(creators.map((c) => c.niche)));
  const vibes = Array.from(new Set(creators.map((c) => c.vibe).filter(Boolean)));

  const saved = creators.filter((c) => ids.includes(c.id));
  const filtered = saved.filter((c) => {
    const erMatch = !minER || c.engagementRate >= parseFloat(minER);
    const nicheMatch = !niche || c.niche === niche;
    const vibeMatch = !vibe || c.vibe === vibe;
    return erMatch && nicheMatch && vibeMatch;
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Inbox</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Niches</option>
            {niches.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.1"
            value={minER}
            onChange={(e) => setMinER(e.target.value)}
            placeholder="Min ER%"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Vibes</option>
            {vibes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No saved creators found.</p>
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
