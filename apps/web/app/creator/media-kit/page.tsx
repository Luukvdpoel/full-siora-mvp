"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { loadPersonasFromLocal, StoredPersona } from "@creator/lib/localPersonas";
import type { PersonaProfile, FullPersona } from "@creator/types/persona";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a4.5 4.5 0 00-4.5 4.5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1.5v-3A4.5 4.5 0 0012 1.5zm-3 4.5a3 3 0 116 0v3h-6v-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function MediaKitPage() {
  const { data: session, status } = useSession();
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const persona = personas[selectedIndex]?.persona as PersonaProfile | undefined;

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session || session.user?.plan !== "pro") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <LockIcon className="w-8 h-8 mb-4" />
        <p className="mb-4">Alleen beschikbaar voor Pro-gebruikers.</p>
        <Link href="/subscribe" className="text-indigo-600 underline">
          Upgrade naar Pro
        </Link>
      </main>
    );
  }


  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.url;
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
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Personal Media Kit</h1>
      <div className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1">Select Persona</label>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
          >
            {personas.map((p, idx) => (
              <option key={idx} value={idx}>
                {(p.persona as { name?: string }).name || `Persona ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Download als PDF (€4.99)
        </button>
      </div>

      {persona && (
        <section id="media-kit" className="space-y-4 border border-white/10 p-4 rounded-md">
          <h2 className="text-xl font-semibold">{persona.name}</h2>
          <p className="italic text-sm">{persona.personality}</p>

          <div>
            <h3 className="font-semibold">Bio</h3>
            <p className="text-sm text-foreground/80">{persona.summary}</p>
          </div>

          {persona.interests && persona.interests.length > 0 && (
            <div>
              <h3 className="font-semibold">Content Samples</h3>
              <ul className="list-disc list-inside text-sm text-foreground/80">
                {persona.interests.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          )}

          {(persona.postingFrequency || persona.toneConfidence || persona.brandFit) && (
            <div>
              <h3 className="font-semibold">Audience Stats</h3>
              {persona.postingFrequency && (
                <p className="text-sm">Posting: {persona.postingFrequency}</p>
              )}
              {persona.toneConfidence != null && (
                <p className="text-sm">Tone Confidence: {persona.toneConfidence}%</p>
              )}
              {persona.brandFit && (
                <p className="text-sm">Brand Fit: {persona.brandFit}</p>
              )}
            </div>
          )}

          {"vibe" in persona && (
            <div>
              <h3 className="font-semibold">Vibe</h3>
              <p className="text-sm text-foreground/80">{(persona as FullPersona).vibe}</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

