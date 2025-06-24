"use client";

import { useEffect, useState } from "react";
import PersonaCard from "@creator/components/PersonaCard";
import type { PersonaProfile } from "@creator/types/persona";

export default function SavedPersonasPage() {
  const [profiles, setProfiles] = useState<PersonaProfile[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("savedPersonas");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProfiles(parsed as PersonaProfile[]);
        } else if (parsed && typeof parsed === "object") {
          setProfiles([parsed as PersonaProfile]);
        }
      }
    } catch (err) {
      console.error("Failed to load personas", err);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      <h1 className="text-2xl font-bold">Saved Personas</h1>
      {profiles.length === 0 ? (
        <p className="text-foreground/60">No saved personas found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, idx) => (
            <PersonaCard key={idx} profile={profile} />
          ))}
        </div>
      )}
    </main>
  );
}
