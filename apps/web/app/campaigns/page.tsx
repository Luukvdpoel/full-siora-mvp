'use client';
import React from 'react';

import { useState } from "react";
import { campaigns } from "@/app/data/campaigns";

export default function CampaignsPage() {
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

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
                className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {c.brand} – {c.name}
                </h2>
                <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
                  {c.requirements}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  Budget: ${'{'}c.budgetMin{'}'} - ${'{'}c.budgetMax{'}'}
                </p>
                <button
                  onClick={() => alert('Apply flow coming soon!')}
                  className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
                >
                  Apply as Creator
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

