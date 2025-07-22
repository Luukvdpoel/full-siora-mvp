'use client';
import React from 'react';

import { useEffect, useState } from "react";

const STORAGE_KEY = "brandFitAnswers";

export default function BrandFitPage() {
  const [admire, setAdmire] = useState("");
  const [dream, setDream] = useState("");
  const [audienceProduct, setAudienceProduct] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAdmire(parsed.admire || "");
        setDream(parsed.dream || "");
        setAudienceProduct(parsed.audienceProduct || "");
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ admire, dream, audienceProduct })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore errors for now
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Brand Fit Questions</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1">What types of brands do you admire?</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={admire}
            onChange={(e) => setAdmire(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">What's your dream sponsorship?</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">What kind of product would your audience love?</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={audienceProduct}
            onChange={(e) => setAudienceProduct(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Save Answers
        </button>
        {saved && <p className="text-green-500 text-sm">Saved!</p>}
      </form>
    </main>
  );
}
