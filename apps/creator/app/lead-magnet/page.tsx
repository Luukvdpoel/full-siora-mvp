"use client";

import { useState, useEffect } from "react";
import type { LeadMagnetIdea } from "@/types/leadMagnet";
import {
  saveLeadMagnetIdea,
  loadLeadMagnetIdea,
} from "@/lib/localLeadMagnet";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function LeadMagnetPage() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [idea, setIdea] = useState<LeadMagnetIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = loadLeadMagnetIdea();
    if (stored) setIdea(stored);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!niche.trim() || !audience.trim()) return;
    setLoading(true);
    setIdea(null);
    setError("");
    try {
      const res = await fetch("/api/leadMagnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, audience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setIdea(data as LeadMagnetIdea);
      saveLeadMagnetIdea(data as LeadMagnetIdea);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Lead Magnet Idea Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1">Your niche</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Describe your audience</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading || !niche.trim() || !audience.trim()}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {idea && (
        <div className="space-y-4 border border-white/10 p-6 rounded-md bg-background">
          <h2 className="text-xl font-bold">{idea.title}</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-sm text-foreground/80">{idea.description}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-sm text-foreground/80">Benefit: {idea.benefit}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span className="text-sm font-semibold">CTA: {idea.cta}</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
