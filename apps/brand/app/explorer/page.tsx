"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import personas from "@/app/data/mock_creators_200.json";
import PersonaCard from "@/components/PersonaCard";

// Limit dataset to first 5 example personas
type Persona = (typeof personas)[number];
const samplePersonas: Persona[] = (personas as Persona[]).slice(0, 5);

export default function ExplorerPage() {
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");

  const filtered = samplePersonas.filter((p) => {
    const matchTone = !tone || p.tone.toLowerCase().includes(tone.toLowerCase());
    const matchPlatform =
      !platform || p.platform.toLowerCase().includes(platform.toLowerCase());
    const matchNiche = !niche || p.niche.toLowerCase().includes(niche.toLowerCase());
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
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Filter by tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Filter by platform"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Filter by niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No personas match.</p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((p) => (
              <PersonaCard key={p.id} persona={p} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
