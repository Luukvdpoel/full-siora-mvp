import React from 'react';
"use client";

import { useState } from "react";
import type { Creator } from "@/app/data/creators";

interface Match {
  creator: Creator;
  score: number;
  reason: string;
}

export default function GoalDashboard() {
  const [goals, setGoals] = useState("");
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [audience, setAudience] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [sort, setSort] = useState<"score" | "name">("score");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/goal-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals, tone, platform, audience })
      });
      const data = await res.json();
      if (Array.isArray(data.matches)) setMatches(data.matches as Match[]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  }

  const sorted = [...matches].sort((a, b) => {
    return sort === "score"
      ? b.score - a.score
      : a.creator.name.localeCompare(b.creator.name);
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Campaign Matcher</h1>
        {error && (
          <p className="text-red-500">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input value={goals} onChange={e => setGoals(e.target.value)} placeholder="Campaign goals" className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border" />
          <input value={tone} onChange={e => setTone(e.target.value)} placeholder="Tone" className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border" />
          <input value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Platform" className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border" />
          <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Audience" className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border" />
        </div>
        <button onClick={fetchMatches} className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold">
          {loading ? "Searching..." : "Find Matches"}
        </button>

        {matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <button onClick={() => setSort("score")} className="px-3 py-1 rounded border border-Siora-border">Sort by Score</button>
              <button onClick={() => setSort("name")} className="px-3 py-1 rounded border border-Siora-border">Sort by Name</button>
            </div>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Creator</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(m => (
                  <tr key={m.creator.id} className="border-t border-Siora-border">
                    <td className="p-2">{m.creator.name}</td>
                    <td className="p-2">{Math.round(m.score)}</td>
                    <td className="p-2">{m.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
