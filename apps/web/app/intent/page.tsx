'use client';
import React from 'react';

import { useState } from "react";
import PersonaCard from "@/components/PersonaCard";
import type { Creator } from "@/app/data/creators";

type Persona = Creator;

export default function IntentPage() {
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState("");
  const [results, setResults] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, tone }),
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
        <h1 className="text-4xl font-extrabold tracking-tight">Campaign Intent Search</h1>

        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Describe your campaign goals and target audience"
          className="w-full h-32 p-3 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="Preferred tone (optional)"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <button
          onClick={runSearch}
          className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Find Creators"}
        </button>

        {results.length === 0 && !loading && (
          <p className="text-center text-zinc-400 mt-10">No matching personas.</p>
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
