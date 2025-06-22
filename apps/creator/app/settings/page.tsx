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

  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      setLoading(false);
      alert("Error creating checkout");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        <Settings persona={profile} onChange={handleChange} />
      </div>
      <div className="border border-white/10 rounded-lg p-6 bg-background">
        <h2 className="text-xl font-semibold mb-2">Upgrade to Pro</h2>
        <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
          <li>Onbeperkte personas</li>
          <li>Toegang tot alle AI-tools</li>
          <li>Prioritaire ondersteuning</li>
        </ul>
        <p className="text-lg font-bold mb-4">€29 per maand</p>
        <button
          onClick={upgrade}
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Bezig..." : "Upgrade via Stripe"}
        </button>
      </div>
    </main>
  );
}
