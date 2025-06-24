"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import personas from "@/app/data/mock_creators_200.json";
import BrandPersonaCard from "@/components/BrandPersonaCard";

// Limit dataset to first 5 example personas
type Persona = (typeof personas)[number];
const samplePersonas: Persona[] = (personas as Persona[]).slice(0, 5);

export default function ExplorerPage() {
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");

  const unique = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as string[];

  const tones = unique(samplePersonas.map((p) => p.tone));
  const platforms = unique(samplePersonas.map((p) => p.platform));
  const niches = unique(samplePersonas.map((p) => p.niche));

  const filtered = samplePersonas.filter((p) => {
    const matchTone = !tone || p.tone === tone;
    const matchPlatform = !platform || p.platform === platform;
    const matchNiche = !niche || p.niche === niche;
    return matchTone && matchPlatform && matchNiche;
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold tracking-tight"
        >
          Persona Explorer
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Tones</option>
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
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
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No personas match.</p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((p) => (
              <BrandPersonaCard key={p.id} persona={p} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
