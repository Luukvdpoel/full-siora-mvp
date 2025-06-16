"use client";

import { useState } from "react";
import PersonaCard from "../../creator/components/PersonaCard";

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
];

export default function Page() {
  const [query, setQuery] = useState("");

  const filtered = personas.filter((p) =>
    `${p.name} ${p.personality} ${p.interests.join(" ")} ${p.summary}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 md:px-10 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Find Creators</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the vibe you're seeking..."
          className="w-full p-3 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />

        {filtered.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">No matching personas found.</p>
        )}

        <div className="grid gap-6">
          {filtered.map((profile) => (
            <PersonaCard key={profile.name} profile={profile} />
          ))}
        </div>
      </div>
    </main>
  );
}
