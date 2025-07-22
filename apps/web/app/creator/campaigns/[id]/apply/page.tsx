"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { useToast } from "@creator/components/Toast";
import { useParams } from "next/navigation";
import campaigns from "@/app/creator/data/campaigns";
import { loadPersonasFromLocal, StoredPersona } from "@creator/lib/localPersonas";

export default function ApplyPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const campaign = campaigns.find((c) => c.id === id);
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [index, setIndex] = useState(0);
  const [pitch, setPitch] = useState("");
  const [summary, setSummary] = useState("");
  const toast = useToast();

  useEffect(() => {
    const list = loadPersonasFromLocal();
    setPersonas(list);
    if (list[0]) setSummary(list[0].persona.summary);
  }, []);

  useEffect(() => {
    async function gen() {
      if (!campaign || !personas[index]) return;
      try {
        const res = await fetch("/api/pitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona: personas[index].persona, brand: campaign.brand }),
        });
        const data = await res.json();
        setPitch(data.pitch || "");
      } catch {
        // ignore
      }
      setSummary(personas[index].persona.summary);
    }
    gen();
  }, [campaign, personas, index]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaign) return;
    await fetch("/api/campaign-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, pitch, personaSummary: summary }),
    });
    toast("Application submitted");
  };

  if (!campaign) return <p>Campaign not found.</p>;
  if (personas.length === 0) return <p>Create a persona first.</p>;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Apply to {campaign.title}</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Select Persona</label>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={index}
            onChange={(e) => setIndex(parseInt(e.target.value, 10))}
          >
            {personas.map((p, idx) => (
              <option key={idx} value={idx}>
                {(p.persona as { name?: string }).name || `Persona ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Pitch</label>
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            rows={4}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Persona Summary</label>
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Submit Application
        </button>
      </form>
    </main>
  );
}
