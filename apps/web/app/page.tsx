"use client";
import React from 'react';

import { useState } from "react";
import PersonaCard from "../creator/components/PersonaCard";

export interface PersonaProfile {
  name: string;
  personality: string;
  interests: string[];
  summary: string;
}

const personas: PersonaProfile[] = [
  {
    name: "Bold Bella",
    personality: "funny and bold",
    interests: ["fashion", "comedy", "pop culture"],
    summary:
      "Energetic influencer mixing loud outfits with irreverent humor to entertain her audience.",
  },
  {
    name: "Chill Charlie",
    personality: "laid-back and adventurous",
    interests: ["outdoors", "travel", "lifestyle"],
    summary:
      "Free-spirited creator capturing spontaneous adventures and encouraging viewers to explore.",
  },
  {
    name: "Mindful Mia",
    personality: "thoughtful and inspiring",
    interests: ["wellness", "self care", "positivity"],
    summary:
      "Shares daily mindfulness tips and motivational thoughts to keep followers grounded.",
  },
  {
    name: "Eco Ellie",
    personality: "environmentally conscious and creative",
    interests: ["sustainability", "DIY", "nature"],
    summary:
      "Creates eco-friendly projects and tips that inspire followers to live greener.",
  },
  {
    name: "Techy Theo",
    personality: "geeky and insightful",
    interests: ["technology", "gaming", "innovation"],
    summary:
      "Reviews gadgets and explores the future of tech with a fun spin.",
  },
];

export default function Page() {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filtered = personas.filter(
    (p) =>
      p.personality.toLowerCase().includes(q) ||
      p.interests.some((interest) => interest.toLowerCase().includes(q))
  );

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gradient-radial dark:from-Siora-dark dark:via-Siora-mid dark:to-Siora-light dark:text-white px-6 md:px-10 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Find Creators</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I'm looking for creators who are..."
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white placeholder-zinc-400 border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />

        {filtered.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">No matching personas found.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((profile) => (
            <PersonaCard key={profile.name} profile={profile} />
          ))}
        </div>
      </div>
    </main>
  );
}
