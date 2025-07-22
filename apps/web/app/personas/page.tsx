"use client";
import React from 'react';

import { useState } from "react";
import personas from "@/app/data/mock_creators_200.json";
import PersonaCard from "@/components/PersonaCard";

type Persona = (typeof personas)[number];

export default function PersonasPage() {
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [vibe, setVibe] = useState("");
  const [niche, setNiche] = useState("");
  const [tag, setTag] = useState("");
  const [format, setFormat] = useState("");

  const filtered = personas.filter((p: Persona) => {
    const matchTone = !tone || p.tone.toLowerCase().includes(tone.toLowerCase());
    const matchPlatform =
      !platform || p.platform.toLowerCase().includes(platform.toLowerCase());
    const matchVibe =
      !vibe ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(vibe.toLowerCase())));
    const matchNiche = !niche || p.niche.toLowerCase().includes(niche.toLowerCase());
    const matchTag =
      !tag ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase())));
    const matchFormat =
      !format ||
      (p.formats && p.formats.some((f: string) => f.toLowerCase().includes(format.toLowerCase())));

    return (
      matchTone &&
      matchPlatform &&
      matchVibe &&
      matchNiche &&
      matchTag &&
      matchFormat
    );
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Persona Search</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Search tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Search platform"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Search vibe"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Search niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tone tag"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="Format"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No personas found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p: Persona) => (
              <PersonaCard key={p.id} persona={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
