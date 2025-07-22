import React from 'react';
"use client";

import { useEffect, useState } from "react";
import { loadPersonasFromLocal, StoredPersona } from "@creator/lib/localPersonas";
import type { PersonaProfile } from "@creator/types/persona";
import type { MonetizationPlan } from "@creator/types/monetization";

export default function MonetizationBlueprintPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const computeBrandFit = (interests: string[]): string => {
    const lower = interests.map((i) => i.toLowerCase());
    const fitness = ["fitness", "workout", "health", "wellness"];
    const fashion = ["fashion", "style", "beauty", "clothing"];
    if (lower.some((i) => fitness.some((k) => i.includes(k)))) return "fitness";
    if (lower.some((i) => fashion.some((k) => i.includes(k)))) return "fashion";
    return "business";
  };

  const computePlan = (fit: string): MonetizationPlan => {
    switch (fit) {
      case "fitness":
        return [
          {
            title: "Sell Workout Program",
            steps: [
              "Create a digital plan (PDF or Notion)",
              "Upload and price on Gumroad",
              "Share product link in your bio",
            ],
            platform: { label: "Gumroad", url: "https://gumroad.com" },
          },
          {
            title: "1‑on‑1 Coaching",
            steps: [
              "Set availability with Calendly",
              "Host sessions via Zoom or Google Meet",
              "Promote coaching on social posts",
            ],
            platform: { label: "Calendly", url: "https://calendly.com" },
          },
          {
            title: "Brand Sponsorships",
            steps: [
              "Prepare a short media kit",
              "Join influencer platforms to find deals",
              "Pitch fitness brands you love",
            ],
            platform: { label: "Aspire", url: "https://aspire.io" },
          },
        ];
      case "fashion":
        return [
          {
            title: "Style Lookbook Templates",
            steps: [
              "Design outfits or moodboards",
              "Sell templates through Gumroad",
              "Link to them in stories and posts",
            ],
            platform: { label: "Gumroad", url: "https://gumroad.com" },
          },
          {
            title: "Personal Styling Sessions",
            steps: [
              "Use Calendly for scheduling",
              "Meet clients over video calls",
              "Collect testimonials for social proof",
            ],
            platform: { label: "Calendly", url: "https://calendly.com" },
          },
          {
            title: "Fashion Brand UGC",
            steps: [
              "Sign up to creator marketplaces",
              "Offer to shoot outfit content",
              "Negotiate paid collaborations",
            ],
            platform: { label: "Aspire", url: "https://aspire.io" },
          },
        ];
      default:
        return [
          {
            title: "Notion Templates or eBook",
            steps: [
              "Package your expertise into a resource",
              "Sell directly through Gumroad",
              "Share download link across platforms",
            ],
            platform: { label: "Gumroad", url: "https://gumroad.com" },
          },
          {
            title: "Consulting or Coaching",
            steps: [
              "Set up booking with Calendly",
              "Advertise availability on LinkedIn",
              "Run sessions via Zoom",
            ],
            platform: { label: "Calendly", url: "https://calendly.com" },
          },
          {
            title: "Sponsorships & Affiliates",
            steps: [
              "Register on brand deal platforms",
              "Create a concise pitch",
              "Reach out to aligned companies",
            ],
            platform: { label: "ShareASale", url: "https://www.shareasale.com" },
          },
        ];
    }
  };

  if (personas.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>No saved personas found. Generate one first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-8">
      <h1 className="text-2xl font-bold">Monetization Blueprint</h1>
      {personas.map((item, idx) => {
        const persona = item.persona as PersonaProfile;
        const fit = computeBrandFit(persona.interests ?? []);
        const plan = computePlan(fit);
        return (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-semibold">{persona.name}</h2>
            <ul className="space-y-4">
              {plan.map((stream, i) => (
                <li key={i} className="border border-white/10 p-4 rounded-md">
                  <h3 className="font-semibold mb-1">{stream.title}</h3>
                  <ol className="list-decimal ml-5 text-sm space-y-1">
                    {stream.steps.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <a
                    href={stream.platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 underline text-sm block mt-2"
                  >
                    {stream.platform.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </main>
  );
}
