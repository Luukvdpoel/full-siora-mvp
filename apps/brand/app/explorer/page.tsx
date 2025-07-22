import React from 'react';
"use client";
import { useState, useMemo } from "react";
import creatorsData from "../../../web/app/data/mock_creators_200.json";
import PersonaCard from "../../../web/components/PersonaCard";

type Creator = (typeof creatorsData)[number];

export default function BrandExplorerPage() {
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [values, setValues] = useState("");
  const [bestFirst, setBestFirst] = useState(true);

  const unique = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as string[];

  const niches = unique(creatorsData.map((c) => c.niche));
  const tones = unique(creatorsData.map((c) => c.tone));
  const valueOptions = unique(creatorsData.flatMap((c) => c.tags || []));

  const filtered = useMemo(() => {
    const valList = values
      .split(/[,\s]+/)
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);

    return creatorsData
      .map((c) => {
        const creatorValues = (c.tags || []).map((t) => t.toLowerCase());
        const sharedValues = valList.filter((v) => creatorValues.includes(v));
        const toneScore = tone && c.tone.toLowerCase() === tone.toLowerCase() ? 1 : 0;
        const nicheScore = niche && c.niche.toLowerCase() === niche.toLowerCase() ? 1 : 0;
        const matchScore = sharedValues.length + toneScore + nicheScore;
        return { ...c, matchScore, sharedValues } as Creator & { matchScore: number; sharedValues: string[] };
      })
      .filter((c) => {
        const followerOk =
          (!minFollowers || c.followers >= parseInt(minFollowers)) &&
          (!maxFollowers || c.followers <= parseInt(maxFollowers));
        const toneOk = !tone || c.tone === tone;
        const nicheOk = !niche || c.niche === niche;
        const valuesOk = valList.length === 0 || c.sharedValues.length > 0;
        return followerOk && toneOk && nicheOk && valuesOk;
      })
      .sort((a, b) => (bestFirst ? b.matchScore - a.matchScore : 0));
  }, [niche, tone, minFollowers, maxFollowers, values, bestFirst]);

  const scoreColor = (score: number) => {
    if (score >= 3) return "bg-green-600";
    if (score >= 2) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Creator Explorer</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <select value={niche} onChange={(e) => setNiche(e.target.value)} className="p-2 rounded bg-Siora-light">
            <option value="">All Niches</option>
            {niches.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="p-2 rounded bg-Siora-light">
            <option value="">All Tones</option>
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input type="number" placeholder="Min Followers" value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} className="p-2 rounded bg-Siora-light" />
          <input type="number" placeholder="Max Followers" value={maxFollowers} onChange={(e) => setMaxFollowers(e.target.value)} className="p-2 rounded bg-Siora-light" />
          <input list="valueslist" placeholder="Values" value={values} onChange={(e) => setValues(e.target.value)} className="p-2 rounded bg-Siora-light" />
          <datalist id="valueslist">
            {valueOptions.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={bestFirst} onChange={(e) => setBestFirst(e.target.checked)} />
            Show best matches first
          </label>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No matching creators.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="relative">
                <PersonaCard persona={p} />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${scoreColor(p.matchScore)}`}>{p.matchScore}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
