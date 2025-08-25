'use client';
import React from 'react';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import creators from "@/app/data/mock_creators_200.json";
import { useShortlist } from "@/lib/shortlist";
import { useBrandUser } from "@/lib/brandUser";
import type { BrandProfile, CreatorPersona } from "../../../../packages/shared-utils/src";
import { getFitScore, generateMatchExplanation } from "../../../../packages/shared-utils/src";
import posthog from 'posthog-js'

export default function MatchesPage() {
  const { user } = useBrandUser();
  const { toggle, inShortlist } = useShortlist(user?.email ?? null);
  const [brand, setBrand] = useState<BrandProfile | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("brandPrefs");
    if (stored) {
      try {
        setBrand(JSON.parse(stored));
      } catch {
        setBrand(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Please sign in.</p>
      </main>
    );
  }

  const top = useMemo(() => {
    if (!brand) return [];
    return creators
      .map((c) => {
        const persona: CreatorPersona = {
          niches: [c.niche],
          tone: c.tone,
          platforms: [c.platform],
          vibe: Array.isArray(c.tags) ? c.tags.join(" ") : undefined,
        };
        const { score } = getFitScore(persona, brand);
        return { creator: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [brand]);

  if (!brand) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">No signup preferences found.</p>
      </main>
    );
  }

  return (
    <>
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Your Top Matches</h1>
        <div className="space-y-4">
          {top.map(({ creator, score }) => {
            const persona: CreatorPersona = {
              niches: [creator.niche],
              tone: creator.tone,
              platforms: [creator.platform],
              vibe: Array.isArray(creator.tags) ? creator.tags.join(" ") : undefined,
            };
            const reasons = generateMatchExplanation(brand, persona);
            return (
            <div key={creator.id} className="bg-Siora-mid border border-Siora-border rounded-xl p-6 shadow-Siora-hover">
              <h2 className="text-xl font-semibold">
                {creator.name} <span className="text-Siora-accent">@{creator.handle}</span>
              </h2>
              <p className="text-sm text-zinc-400 mb-2">{Math.round(score)}% match</p>
              <p className="text-sm text-zinc-300 mb-4">{creator.summary}</p>
              {reasons.length > 0 && (
                <div className="mb-2 text-xs text-zinc-300">
                  <span className="font-semibold">Why this match:</span>
                  <ul className="list-disc list-inside">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => toggle(creator.id)}
                  className="px-3 py-1 text-sm rounded bg-Siora-accent text-white"
                >
                  {inShortlist(creator.id) ? "Remove from Shortlist" : "Add to Shortlist"}
                </button>
                <Link
                  href={`/dashboard/persona/${creator.handle.replace(/^@/, "")}`}
                  className="px-3 py-1 text-sm rounded border border-Siora-border text-white"
                  onClick={() => posthog.capture('Match Clicked', { creatorId: creator.id })}
                >
                  View Persona
                </Link>
                <Link
                  href={`/messages/${creator.id}`}
                  className="px-3 py-1 text-sm rounded border border-Siora-border text-white"
                >
                  Send Message
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </main>
    </>
  );
}
