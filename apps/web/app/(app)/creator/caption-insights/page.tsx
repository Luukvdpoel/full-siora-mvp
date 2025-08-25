'use client';
import React from 'react';

import { useState } from "react";
import type { CaptionInsightsResponse } from "@creator/types/insights";

export default function CaptionInsightsPage() {
  const [captions, setCaptions] = useState("");
  const [result, setResult] = useState<CaptionInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const captionList = captions
    .split(/\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (captionList.length < 3) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/captionInsights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captions: captionList }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center p-6 md:p-10 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg p-6 space-y-4 backdrop-blur"
      >
        <label className="block text-sm font-semibold">Paste 3–10 captions</label>
        <textarea
          className="w-full h-40 p-3 rounded-md bg-zinc-800 text-white resize-none placeholder-zinc-400"
          rows={8}
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
          placeholder={"Caption one\nCaption two"}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 rounded-md disabled:opacity-50"
          disabled={loading || captionList.length < 3}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {error && <p className="text-red-500">Error: {error}</p>}

      {result && (
        <div className="w-full max-w-2xl space-y-4">
          <p className="text-zinc-300">{result.summary}</p>
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-white/10">
              <tr>
                <th className="p-2 border border-white/10 text-left">Caption</th>
                <th className="p-2 border border-white/10 text-left">Tone</th>
                <th className="p-2 border border-white/10 text-left">Content Type</th>
                <th className="p-2 border border-white/10 text-left">Themes</th>
              </tr>
            </thead>
            <tbody>
              {result.insights.map((row, idx) => (
                <tr key={idx} className="odd:bg-white/5">
                  <td className="p-2 border border-white/10">{row.caption}</td>
                  <td className="p-2 border border-white/10">{row.tone}</td>
                  <td className="p-2 border border-white/10">{row.contentType}</td>
                  <td className="p-2 border border-white/10">{row.themes.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
