"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PersonaCard, { PersonaProfile } from "@/components/PersonaCard";

export default function PersonaPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [profile, setProfile] = useState<PersonaProfile | null>(null);

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
      if (selected) setProfile(selected);
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
    <main className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center gap-6">
      {profile ? <PersonaCard profile={profile} /> : <p>Persona not found.</p>}
      {profile && (
        <button
          type="button"
          onClick={handleCopy}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 px-4 rounded-md"
        >
          Copy link
        </button>
      )}
    </main>
  );
}
