'use client';
import React from 'react';

import { useState, useEffect } from "react";
import { campaigns } from "@/app/data/campaigns";
import { Badge } from "shared-ui";
import FeedbackButton from "@/components/FeedbackButton";

interface Fairness {
  fair: boolean;
  concerns: string[];
}

export default function CampaignsPage() {
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [fairness, setFairness] = useState<Record<string, Fairness>>({});

  useEffect(() => {
    campaigns.forEach(async (c) => {
      try {
        const res = await fetch('/api/fairness/evaluateCampaign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: c.name,
            description: c.requirements,
            deliverables: c.requirements,
            compensation: `${c.budgetMin}-${c.budgetMax}`,
          }),
        });
        if (res.ok) {
          const data: Fairness = await res.json();
          setFairness((prev) => ({ ...prev, [c.id]: data }));
        }
      } catch (err) {
        console.error('fairness check failed', err);
      }
    });
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchPlatform =
      !platform || c.platform.toLowerCase().includes(platform.toLowerCase());
    const matchNiche = !niche || c.niche.toLowerCase().includes(niche.toLowerCase());
    const min = parseInt(minBudget || "0", 10);
    const max = parseInt(maxBudget || "0", 10);
    const matchMin = !minBudget || c.budgetMax >= min;
    const matchMax = !maxBudget || c.budgetMin <= max;
    return matchPlatform && matchNiche && matchMin && matchMax;
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Live Campaigns</h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Platform"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            type="number"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            placeholder="Min Budget"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="Max Budget"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No campaigns found.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover space-y-2"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  {c.brand} – {c.name}
                  {fairness[c.id] && !fairness[c.id].fair && (
                    <Badge label="Unfair offer" className="bg-red-600 text-white" />
                  )}
                </h2>
                {fairness[c.id] && fairness[c.id].concerns.length > 0 && (
                  <p className="text-xs text-red-400">
                    {fairness[c.id].concerns[0]}
                  </p>
                )}
                <p className="text-sm text-gray-700 dark:text-zinc-300">
                  {c.requirements}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Budget: ${'{'}c.budgetMin{'}'} - ${'{'}c.budgetMax{'}'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => alert('Apply flow coming soon!')}
                    className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
                  >
                    Apply as Creator
                  </button>
                  <FeedbackButton id={c.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

