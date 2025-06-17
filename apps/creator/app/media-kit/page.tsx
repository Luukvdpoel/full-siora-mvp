"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { PersonaProfile, FullPersona } from "@/types/persona";

export default function MediaKitPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const persona = personas[selectedIndex]?.persona as PersonaProfile | undefined;

  const downloadPdf = () => {
    if (!persona) return;
    const element = document.getElementById("media-kit");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save(`${persona.name || "media-kit"}.pdf`),
      html2canvas: { scale: 0.6 },
    });
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
          onClick={downloadPdf}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Download as PDF
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

