"use client";

import { useEffect, useState } from "react";
import PersonaCard from "@creator/components/PersonaCard";
import { loadPersonasFromLocal, savePersonaToLocal, StoredPersona } from "@creator/lib/localPersonas";
import type { PersonaProfile } from "@creator/types/persona";

export default function RefinePersonaPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [updates, setUpdates] = useState("");
  const [result, setResult] = useState<PersonaProfile | null>(null);
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
      const res = await fetch("/api/refinePersona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personas[selectedIndex].persona, updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data as PersonaProfile);
      savePersonaToLocal(data as PersonaProfile);
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

  const current = personas[selectedIndex].persona as PersonaProfile;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Refine Persona</h1>
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
                {(p.persona as { name?: string }).name || `Persona ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">New creator info</label>
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white h-32 resize-none"
            value={updates}
            onChange={(e) => setUpdates(e.target.value)}
            placeholder="What's changed or new?"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading || !updates.trim()}
        >
          {loading ? "Refining..." : "Refine Persona"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-2">Before</h2>
            <PersonaCard profile={current} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">After</h2>
            <PersonaCard profile={result} />
          </div>
        </div>
      )}
    </main>
  );
}
