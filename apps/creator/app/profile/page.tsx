"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { FullPersona } from "@/types/persona";

export default function ProfilePage() {
  const [persona, setPersona] = useState<FullPersona | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/personas");
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setPersona(list[0].data as FullPersona);
            return;
          }
        }
      } catch {
        // ignore and fall back to local
      }
      const local: StoredPersona[] = loadPersonasFromLocal();
      if (local.length > 0) setPersona(local[0].persona as FullPersona);
    }
    load();
  }, []);

  const downloadPdf = () => {
    const element = document.getElementById("profile-page");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save("media-kit.pdf"),
      html2canvas: { scale: 0.6 },
    });
  };

  if (!persona) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <p>No persona found.</p>
      </main>
    );
  }

  const favFormats = (persona as Partial<{ favFormats: string }>).favFormats
    ? (persona as Partial<{ favFormats: string }>).favFormats!.split(",")
    : ["Short form video", "Tutorial threads", "Behind-the-scenes posts"];

  return (
    <main
      id="profile-page"
      className="min-h-screen bg-background text-foreground p-6 space-y-10 max-w-3xl mx-auto"
    >
      <section className="text-center space-y-4">
        <img
          src={persona.image || "/avatar-placeholder.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <h1 className="text-3xl font-bold">{persona.name}</h1>
        <p className="text-lg italic text-foreground/70">{persona.personality}</p>
        <ReactMarkdown className="prose prose-invert mx-auto">
          {persona.summary}
        </ReactMarkdown>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Tone & Aesthetic</h2>
          <p className="text-sm text-foreground/80">
            {(persona as Partial<{ vibe: string }>).vibe || "Energetic and professional"}
          </p>
          <div className="h-32 bg-zinc-800 rounded-md flex items-center justify-center text-sm text-foreground/60">
            Visuals Placeholder
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Best Performing Formats</h2>
          <ul className="list-disc list-inside text-sm text-foreground/80">
            {favFormats.map((f: string, i: number) => (
              <li key={i}>{f.trim()}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h2 className="text-xl font-semibold">Pro Tips</h2>
          <p className="text-sm text-foreground/80">
            Stay consistent, engage with your audience, and collaborate with similar creators.
          </p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h2 className="text-xl font-semibold">Content Hooks</h2>
          <ul className="list-disc list-inside text-sm text-foreground/80">
            <li>Share quick wins your followers can try today</li>
            <li>Tell personal stories that reveal your journey</li>
            <li>Use trending sounds to boost reach</li>
          </ul>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h2 className="text-xl font-semibold">1-Week Content Plan</h2>
          <table className="w-full text-sm border border-white/10 rounded-md">
            <thead>
              <tr className="bg-white/10">
                <th className="p-2 text-left">Day</th>
                <th className="p-2 text-left">Idea</th>
              </tr>
            </thead>
            <tbody>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <tr key={i} className={i % 2 ? "" : "bg-white/5"}>
                  <td className="p-2">{d}</td>
                  <td className="p-2">Example post idea {i + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h2 className="text-xl font-semibold">Hashtag Strategy</h2>
          <p className="text-sm text-foreground/80">
            Mix niche hashtags with trending tags to increase discovery.
          </p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h2 className="text-xl font-semibold">Sample Post</h2>
          <div className="aspect-video bg-zinc-800 rounded-md flex items-center justify-center text-foreground/60">
            Embedded Content
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <button
          type="button"
          onClick={downloadPdf}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md"
        >
          Download Media Kit
        </button>
        <a
          href="/contact"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-center rounded-md"
        >
          Work with me
        </a>
      </div>
    </main>
  );
}
