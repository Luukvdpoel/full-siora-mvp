import React from 'react';
import type { PersonaProfile } from "@creator/types/persona";

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
      />
    </svg>
  );
}

function LightBulbIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.016 6.016 0 0 0 1.5-.189m-1.5.189a6.016 6.016 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
}

export default function DashboardCard({ persona }: { persona: PersonaProfile }) {
  const computeBrandFit = (interests: string[]): string => {
    const lower = interests.map((i) => i.toLowerCase());
    const fitness = ["fitness", "workout", "health", "wellness"];
    const fashion = ["fashion", "style", "beauty", "clothing"];
    if (lower.some((i) => fitness.some((k) => i.includes(k)))) return "fitness";
    if (lower.some((i) => fashion.some((k) => i.includes(k)))) return "fashion";
    return "business";
  };

  const aestheticLabels: Record<string, string> = {
    fitness: "Active & Vibrant",
    fashion: "Stylish & Chic",
    business: "Clean & Professional",
  };

  const fit = persona.brandFit ?? computeBrandFit(persona.interests ?? []);
  const aesthetic = aestheticLabels[fit] ?? fit;

  return (
    <div className="border border-white/10 bg-background p-4 rounded-xl shadow-sm space-y-3">
      <h3 className="text-lg font-bold">{persona.name}</h3>
      <div className="flex items-center gap-2 text-sm">
        <SparklesIcon className="w-5 h-5 text-indigo-500" />
        <span>{persona.personality}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <PaletteIcon className="w-5 h-5 text-indigo-500" />
        <span>{aesthetic}</span>
      </div>
      <div className="flex items-start gap-2 text-sm">
        <LightBulbIcon className="w-5 h-5 text-indigo-500 mt-0.5" />
        <span>{persona.growthSuggestions ?? "N/A"}</span>
      </div>
    </div>
  );
}
