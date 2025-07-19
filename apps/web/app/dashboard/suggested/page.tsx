"use client";

import { useState } from "react";
import CreatorCard from "@/components/CreatorCard";
import type { Creator } from "@/app/data/creators";
import { useSession } from "next-auth/react";
import { useShortlist } from "@/lib/shortlist";

interface MatchResult {
  persona: Creator;
  score: number;
  reasons: string[];
}

export default function SuggestedCreators() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const user = session?.user?.email ?? null;
  const { toggle, inShortlist } = useShortlist(user);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campaign-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, tone, budget }),
      });
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-siora-dark via-siora-mid to-siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Suggested Creators</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Campaign niche"
            className="w-full p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
          />
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Preferred platform"
            className="w-full p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
          />
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Desired tone"
            className="w-full p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
          />
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="w-full p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
          />
        </div>
        <button
          onClick={submit}
          className="bg-siora-accent hover:bg-siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Find Suggestions"}
        </button>

        {results.length === 0 && !loading && (
          <p className="text-center text-zinc-400 mt-10">No suggestions yet.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r) => (
              <div key={r.persona.id}>
                <CreatorCard
                  creator={r.persona}
                  onShortlist={toggle}
                  shortlisted={inShortlist(r.persona.id)}
                />
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
