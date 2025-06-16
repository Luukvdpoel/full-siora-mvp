"use client";

import { useState, useEffect } from "react";
import CreatorCard from "@/components/CreatorCard";
import { creators as mockCreators, type Creator } from "@/app/data/creators";

export default function Dashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [filtered, setFiltered] = useState<Creator[]>([]);

  // load creators from localStorage if available, otherwise use mock data
  useEffect(() => {
    let stored: Creator[] | null = null;
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("personas");
      if (local) {
        try {
          stored = JSON.parse(local) as Creator[];
        } catch {
          stored = null;
        }
      }
    }
    setCreators(stored || mockCreators);
  }, []);

  // apply filters whenever options change
  useEffect(() => {
    let result = creators;
    if (niche) {
      result = result.filter((c) =>
        c.niche.toLowerCase().includes(niche.toLowerCase())
      );
    }
    if (tone) {
      result = result.filter((c) =>
        c.tone.toLowerCase().includes(tone.toLowerCase())
      );
    }
    if (platform) {
      result = result.filter((c) =>
        c.platform.toLowerCase().includes(platform.toLowerCase())
      );
    }
    setFiltered(result);
  }, [niche, tone, platform, creators]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Creator Personas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500 dark:text-zinc-400">No personas found.</p>
        )}
      </div>
    </div>
  );
}
