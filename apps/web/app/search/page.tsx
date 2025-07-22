import React from 'react';
"use client";

import { useState } from "react";
import PersonaCard from "@/components/PersonaCard";

type Persona = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  platform: string;
  followers: number;
  engagementRate: number;
  summary: string;
  tone: string;
  tags?: string[];
};

export default function SearchPage() {
  const [values, setValues] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [results, setResults] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, tone, audience }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Find Matching Creators</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="Brand values"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Preferred tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Target audience"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>
        <button
          onClick={runSearch}
          className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {results.length === 0 && !loading && (
          <p className="text-center text-zinc-400 mt-10">No matches yet.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((p) => (
              <PersonaCard key={p.id} persona={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
