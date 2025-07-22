"use client";
import React from 'react';

import { useState } from "react";
import creators from "@/app/data/mock_creators_200.json";
import matchCreator from "@/lib/match";

type Creator = (typeof creators)[number];

export default function RecommendPage() {
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [results, setResults] = useState<
    { creator: Creator; score: number; reason: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = {
      niches: audience
        ? audience.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean)
        : undefined,
      tone: tone || undefined,
      desiredFormats: content
        ? content.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean)
        : undefined,
    };
    const brandWithPlatforms = {
      ...brand,
      platforms: platforms
        ? platforms.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean)
        : undefined,
    };
    const scored = (creators as Creator[])
      .map((c) => {
        const persona = {
          niches: [c.niche],
          tone: c.tone,
          platforms: [c.platform],
          vibe: Array.isArray(c.tags) ? c.tags.join(" ") : undefined,
          formats: (c as any).formats,
        };
        const { score, reason } = matchCreator(persona, brandWithPlatforms);
        return { creator: c, score, reason };
      })
      .sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 10));
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Creator Recommendations</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Audience type"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content types"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={platforms}
            onChange={(e) => setPlatforms(e.target.value)}
            placeholder="Platforms"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <button
            type="submit"
            className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold"
          >
            Get Recommendations
          </button>
        </form>
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map(({ creator, score, reason }) => (
              <div
                key={creator.id}
                className="bg-Siora-mid border border-Siora-border rounded-xl p-6 shadow-Siora-hover"
              >
                <h2 className="text-xl font-semibold">
                  {creator.name}{" "}
                  <span className="text-Siora-accent">@{creator.handle}</span>
                </h2>
                <p className="text-sm text-zinc-400 mb-2">Fit Score: {score}/100</p>
                <p className="text-sm text-zinc-300 mb-4">{reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

