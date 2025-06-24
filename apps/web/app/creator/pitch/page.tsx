"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { PitchResult } from "@/types/pitch";

export default function PitchPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<PitchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const generatePitch = async () => {
    if (!personas[selectedIndex]) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personas[selectedIndex].persona, brand }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data as PitchResult);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    await generatePitch();
  };

  const copyPitch = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.pitch).catch(() => {});
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
      <h1 className="text-2xl font-bold">Brand Pitch Generator</h1>
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
          <label className="block text-sm font-semibold mb-1">Brand Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading || !brand}
        >
          {loading ? "Generating..." : "Generate Pitch"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="space-y-4 border border-white/10 p-4 rounded-md bg-background">
          {result.reasoning && (
            <>
              <h2 className="text-lg font-semibold">Why You&apos;re a Fit</h2>
              <div className="prose prose-invert text-sm">
                <ReactMarkdown>{result.reasoning}</ReactMarkdown>
              </div>
            </>
          )}
          <h2 className="text-lg font-semibold">Pitch</h2>
          <div className="prose prose-invert bg-zinc-800 p-3 rounded-md text-sm">
            <ReactMarkdown>{result.pitch}</ReactMarkdown>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={generatePitch}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Generating..." : "Regenerate Pitch"}
            </button>
            <button
              type="button"
              onClick={copyPitch}
              className="bg-green-600 hover:bg-green-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
