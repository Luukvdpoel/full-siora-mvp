'use client';
import React from 'react';

import { useEffect, useState } from "react";
import { loadPersonasFromLocal, StoredPersona } from "@creator/lib/localPersonas";
import type { FitReport } from "@creator/types/fitReport";
import type { PersonaProfile } from "@creator/types/persona";

export default function FitReportPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<FitReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!personas[selectedIndex]) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fitReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personas[selectedIndex].persona, brand }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data as FitReport);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (personas.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>No saved personas found. Generate one first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Fit Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1">Select Persona</label>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
          >
            {personas.map((p, idx) => (
              <option key={idx} value={idx}>
                {(p.persona as PersonaProfile).name || `Persona ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Brand Brief</label>
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            rows={4}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading || !brand.trim()}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="space-y-4 border border-white/10 p-4 rounded-md">
          <div>
            <h2 className="text-lg font-semibold">Vibe Alignment</h2>
            <p className="text-sm text-foreground/80">{result.vibeMatch}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Audience Overlap</h2>
            <p className="text-sm text-foreground/80">{result.audienceMatch}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tone Match</h2>
            <p className="text-sm text-foreground/80">{result.toneMatch}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="text-sm text-foreground/80">{result.summary}</p>
          </div>
        </div>
      )}
    </main>
  );
}
