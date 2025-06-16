"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PersonaCard from "@/components/PersonaCard";
import InsightsSidebar from "@/components/InsightsSidebar";
import type { PersonaProfile } from "@/types/persona";

export default function PersonaPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [profile, setProfile] = useState<PersonaProfile | null>(null);

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

  const handleCopy = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).catch((err) => {
      console.error("Failed to copy", err);
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
      {profile ? (
        <>
          <PersonaCard profile={profile} />
          <InsightsSidebar profile={profile} />
          <button
            type="button"
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md"
          >
            Copy link
          </button>
        </>
      ) : (
        <p>Persona not found.</p>
      )}
    </main>
  );
}
