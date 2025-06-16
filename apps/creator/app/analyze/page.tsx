"use client";

import { useState } from "react";
import PersonaCard, { type PersonaProfile } from "@/components/PersonaCard";

type Persona = PersonaProfile;

export default function AnalyzePage() {
  const [captions, setCaptions] = useState("");
  const [result, setResult] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!result) return;
    try {
      const stored = localStorage.getItem("savedPersonaProfiles");
      const profiles: Persona[] = stored ? JSON.parse(stored) : [];
      profiles.push(result);
      localStorage.setItem("savedPersonaProfiles", JSON.stringify(profiles));
    } catch (err) {
      console.error("Failed to save persona", err);
    }
  };

  const captionList = captions
    .split(/\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/generatePersona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captions: captionList }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center p-6 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg p-6 space-y-4 backdrop-blur"
      >
        <label className="block text-sm font-semibold">
          Paste several recent Instagram captions (one per line):
        </label>
        <textarea
          className="w-full h-40 p-3 rounded-md bg-zinc-800 text-white resize-none placeholder-zinc-400"
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
          placeholder={"First caption\nSecond caption"}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-md disabled:opacity-50"
          disabled={loading || captionList.length === 0}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="space-y-4 flex flex-col items-center">
          <PersonaCard profile={result} />
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded-md"
          >
            Save Persona
          </button>
        </div>
      )}
    </main>
  );
}
