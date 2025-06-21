"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LeadMagnetIdea } from "@/types/leadMagnet";
import {
  loadLeadMagnetIdea,
  saveLeadMagnetIdea,
} from "@/lib/localLeadMagnet";

export default function LeadMagnetDashboard() {
  const [idea, setIdea] = useState<LeadMagnetIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = loadLeadMagnetIdea();
    if (stored) setIdea(stored);
  }, []);

  const regenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leadMagnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: "marketing", audience: "creators" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setIdea(data as LeadMagnetIdea);
      saveLeadMagnetIdea(data as LeadMagnetIdea);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    alert("PDF download coming soon!");
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Lead Magnet</h1>
      {idea ? (
        <div className="space-y-2 border border-white/10 p-4 rounded-md">
          <h2 className="text-lg font-semibold">{idea.title}</h2>
          <p className="text-sm text-foreground/80">{idea.description}</p>
          <p className="text-sm">Benefit: {idea.benefit}</p>
          <p className="text-sm font-semibold">CTA: {idea.cta}</p>
        </div>
      ) : (
        <p>No lead magnet idea generated yet.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={regenerate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Generating..." : "Regenerate"}
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Download as PDF
        </button>
      </div>
      <Link href="/lead-magnet" className="underline text-sm">
        Generate new idea
      </Link>
    </main>
  );
}
