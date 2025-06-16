"use client";

import { useState, useEffect } from "react";
import CreatorCard from "@/components/CreatorCard";
import { creators as mockCreators, type Creator } from "@/app/data/creators";

export default function Dashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [platform, setPlatform] = useState("");
  const [vibe, setVibe] = useState("");
  const [format, setFormat] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
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
    if (platform) {
      result = result.filter((c) =>
        c.platform.toLowerCase().includes(platform.toLowerCase())
      );
    }
    if (vibe) {
      result = result.filter(
        (c) => c.vibe?.toLowerCase().includes(vibe.toLowerCase())
      );
    }
    if (format) {
      result = result.filter(
        (c) => c.formats?.some((f) => f.toLowerCase().includes(format.toLowerCase()))
      );
    }
    if (minScore) {
      const min = parseInt(minScore);
      if (!isNaN(min)) {
        result = result.filter((c) => (c.fitScore ?? 0) >= min);
      }
    }
    if (maxScore) {
      const max = parseInt(maxScore);
      if (!isNaN(max)) {
        result = result.filter((c) => (c.fitScore ?? 0) <= max);
      }
    }
    setFiltered(result);
  }, [platform, vibe, format, minScore, maxScore, creators]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Creator Personas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <select
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
        </select>
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Vibe"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Content format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Min fit score"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Max fit score"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
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
