import React from 'react';

export interface PersonaProfile {
  name: string;
  personality: string;
  interests: string[];
  summary: string;
}

export default function PersonaCard({ profile }: { profile: PersonaProfile }) {
  return (
    <div className="bg-background border border-foreground/20 rounded-xl p-6 shadow-md space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
      <p className="text-sm text-foreground/70">{profile.personality}</p>
      <div className="flex flex-wrap gap-2">
        {profile.interests.map((interest) => (
          <span key={interest} className="bg-foreground/10 text-foreground text-xs px-2 py-1 rounded-full">
            {interest}
          </span>
        ))}
      </div>
      <p className="text-sm text-foreground/80">{profile.summary}</p>
    </div>
  );
}
