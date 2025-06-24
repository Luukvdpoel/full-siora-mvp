"use client";

import { useState } from "react";
import BrandBrandPersonaCard from "@/components/BrandBrandPersonaCard";
import type { Creator } from "@/app/data/creators";

interface MatchResult {
  persona: Creator;
  score: number;
  reasons: string[];
}

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaign-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, niche, platform, tone, budget }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">New Campaign</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Campaign name"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Campaign niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Preferred platform"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Desired tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>
        <button
          onClick={submit}
          className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Suggest Creators"}
        </button>

        {results.length === 0 && !loading && (
          <p className="text-center text-zinc-400 mt-10">No suggestions yet.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r) => (
              <div key={r.persona.id}>
                <BrandPersonaCard persona={r.persona} />
                <p className="mt-2 text-sm text-zinc-300">
                  Match {Math.round(r.score * 100)}% – {r.reasons.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
