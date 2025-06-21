"use client";

import { useEffect, useState } from "react";
import Settings, { ExtendedPersona } from "@/components/Settings";
import { loadProfileSettings, saveProfileSettings } from "@/lib/profileSettings";
import { loadPersonasFromLocal } from "@/lib/localPersonas";

export default function SettingsPage() {
  const [profile, setProfile] = useState<ExtendedPersona | null>(null);

  useEffect(() => {
    const stored = loadProfileSettings();
    if (stored) {
      setProfile({
        name: "My Persona",
        personality: "",
        interests: [],
        summary: stored.bio,
        vibe: stored.tone,
        favFormats: stored.formats.join(','),
        preferredCollabs: stored.collabTypes.join(',')
      });
    } else {
      const local = loadPersonasFromLocal();
      if (local.length > 0) {
        const p = local[0].persona as ExtendedPersona;
        setProfile({
          ...p,
          tagline: (p as any).tagline || '',
          contentPreference: (p as any).contentPreference || '',
          favFormats: (p as any).favFormats || '',
          preferredCollabs: (p as any).preferredCollabs || ''
        });
      }
    }
  }, []);

  const handleChange = (p: ExtendedPersona) => {
    saveProfileSettings({
      bio: p.summary,
      tone: p.vibe ?? '',
      formats: p.favFormats ? p.favFormats.split(',').map(f => f.trim()).filter(Boolean) : [],
      collabTypes: p.preferredCollabs ? p.preferredCollabs.split(',').map(c => c.trim()).filter(Boolean) : []
    });
  };

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>No profile data found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      <Settings persona={profile} onChange={handleChange} />
    </main>
  );
}
