"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PersonaCard from "@creator/components/PersonaCard";
import InsightsSidebar from "@creator/components/InsightsSidebar";
import PersonaPDF from "@creator/components/PersonaPDF";
import CopyLinkButton from "@creator/components/CopyLinkButton";
import type { PersonaProfile } from "@creator/types/persona";

export default function PersonaPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [profile, setProfile] = useState<PersonaProfile | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);

  const computeBrandFit = (interests: string[]): string => {
    const lower = interests.map((i) => i.toLowerCase());
    const fitness = ["fitness", "workout", "health", "wellness"];
    const fashion = ["fashion", "style", "beauty", "clothing"];
    if (lower.some((i) => fitness.some((k) => i.includes(k)))) return "fitness";
    if (lower.some((i) => fashion.some((k) => i.includes(k)))) return "fashion";
    return "business";
  };

  const computePostingFrequency = (fit: string): string => {
    switch (fit) {
      case "fitness":
        return "5 posts/week";
      case "fashion":
        return "3 posts/week";
      case "business":
        return "2 posts/week";
      default:
        return "3 posts/week";
    }
  };

  const computeGrowthSuggestions = (fit: string): string => {
    switch (fit) {
      case "fitness":
        return "Share workout tips daily and track progress with before/after posts.";
      case "fashion":
        return "Post seasonal lookbooks and tag the brands you wear.";
      case "business":
        return "Publish case studies and network on LinkedIn.";
      default:
        return "Collaborate with peers and experiment with short-form video.";
    }
  };

  const ensureInsights = (p: PersonaProfile): PersonaProfile => {
    const fit = p.brandFit ?? computeBrandFit(p.interests ?? []);
    return {
      ...p,
      brandFit: fit,
      postingFrequency: p.postingFrequency ?? computePostingFrequency(fit),
      growthSuggestions: p.growthSuggestions ?? computeGrowthSuggestions(fit),
      toneConfidence: p.toneConfidence ?? 75,
    };
  };


  useEffect(() => {
    if (typeof window === "undefined" || !idParam) return;
    try {
      const stored = localStorage.getItem("savedPersonas");
      if (stored) {
        const parsed = JSON.parse(stored);
      const profiles = Array.isArray(parsed) ? (parsed as PersonaProfile[]) : [parsed as PersonaProfile];
      const index = parseInt(idParam, 10);
      const selected = Number.isNaN(index)
        ? profiles.find((p) => (p as unknown as { id?: string }).id === idParam)
        : profiles[index];
      if (selected) setProfile(ensureInsights(selected));
      }
    } catch (err) {
      console.error("Failed to load persona", err);
    }
  }, [idParam]);


  const toMarkdown = (p: PersonaProfile): string => {
    return `# ${p.name}\n\n` +
      `**Personality:** ${p.personality}\n\n` +
      `**Interests:** ${p.interests.join(", ")}\n\n` +
      `**Summary:** ${p.summary}\n\n` +
      `## Insights\n` +
      `- Posting Frequency: ${p.postingFrequency ?? "N/A"}\n` +
      `- Tone Confidence: ${p.toneConfidence ?? "N/A"}\n` +
      `- Brand Fit: ${p.brandFit ?? "N/A"}\n` +
      `- Growth Suggestions: ${p.growthSuggestions ?? "N/A"}\n`;
  };

  const downloadMarkdown = () => {
    if (!profile) return;
    const md = toMarkdown(profile);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_").toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImprove = async () => {
    if (!profile || rating < 1) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/personaFeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: profile, rating, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.improved) setProfile(data.improved as PersonaProfile);
      }
    } catch (err) {
      console.error('Failed to improve persona', err);
    } finally {
      setGenerating(false);
    }
  };


  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      {profile ? (
        <>
          <div id="persona-content" className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
            <PersonaCard profile={profile} />
            <InsightsSidebar profile={profile} />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={downloadMarkdown}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md"
            >
              Download .md
            </button>
            <PDFDownloadLink
              document={<PersonaPDF profile={profile} />}
              fileName={`${profile.name.replace(/\s+/g, "_").toLowerCase()}.pdf`}
            >
              {({ loading }) => (
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Preparing..." : "Download as PDF"}
                </button>
              )}
            </PDFDownloadLink>
            <CopyLinkButton />
          </div>
          <div className="mt-6 space-y-4 max-w-md">
            <h3 className="font-semibold">How accurate is this?</h3>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => setRating(n)}
                >
                  \u2605
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-2 rounded-md bg-zinc-800 text-white"
              rows={3}
              placeholder="What's missing or off?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              type="button"
              onClick={handleImprove}
              disabled={generating || rating < 1}
              className="bg-green-600 hover:bg-green-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Improved Version'}
            </button>
          </div>
        </>
      ) : (
        <p>Persona not found.</p>
      )}
    </main>
  );
}
