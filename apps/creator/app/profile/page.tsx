"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { PersonaProfile, FullPersona } from "@/types/persona";

const tabs = ["overview", "content", "media", "edit"] as const;

export default function CreatorProfilePage() {
  const [active, setActive] = useState<typeof tabs[number]>("overview");
  const [persona, setPersona] = useState<PersonaProfile | null>(null);
  const [bio, setBio] = useState("");
  const [niche, setNiche] = useState("");
  const [links, setLinks] = useState("");

  useEffect(() => {
    const list: StoredPersona[] = loadPersonasFromLocal();
    if (list.length > 0) {
      setPersona(list[0].persona as PersonaProfile);
      const saved = localStorage.getItem("creator-profile");
      if (saved) {
        try {
          const { bio, niche, links } = JSON.parse(saved);
          setBio(bio || "");
          setNiche(niche || "");
          setLinks(links || "");
        } catch (err) {
          console.error("Failed to parse profile", err);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = { bio, niche, links };
    localStorage.setItem("creator-profile", JSON.stringify(data));
  }, [bio, niche, links]);

  const downloadPdf = () => {
    const element = document.getElementById("media-kit");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save("media-kit.pdf"),
      html2canvas: { scale: 0.6 },
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col items-center space-y-2">
        <img
          src={(persona as FullPersona | null)?.image || "/avatar-placeholder.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <h1 className="text-xl font-bold">{persona?.name || "@handle"}</h1>
        <p className="text-sm text-foreground/60">{persona?.personality || "Tagline"}</p>
      </div>

      <nav className="flex justify-center gap-4 border-b border-white/10 pb-2 text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={
              (active === t ? "text-indigo-500 border-indigo-500" : "text-foreground/60 border-transparent") +
              " pb-1 border-b-2 capitalize"
            }
          >
            {t === "media" ? "Media Kit" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      {active === "overview" && (
        <section className="prose prose-invert">
          {persona ? <ReactMarkdown>{persona.summary}</ReactMarkdown> : <p>No persona found.</p>}
        </section>
      )}

      {active === "content" && (
        <section>
          <p className="text-sm text-foreground/80">Content coming soon.</p>
        </section>
      )}

      {active === "media" && (
        <section className="space-y-4">
          <div id="media-kit" className="p-4 border border-white/10 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Media Kit</h2>
            {persona ? <ReactMarkdown>{persona.summary}</ReactMarkdown> : <p>No persona.</p>}
            {bio && (
              <div>
                <h3 className="font-semibold mt-4">Bio</h3>
                <p className="text-sm">{bio}</p>
              </div>
            )}
            {niche && <p className="text-sm mt-2">Niche: {niche}</p>}
            {links && <p className="text-sm mt-2">Links: {links}</p>}
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
          >
            Download PDF
          </button>
        </section>
      )}

      {active === "edit" && (
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Bio</label>
            <textarea
              className="w-full p-2 rounded-md bg-zinc-800 text-white h-24"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Niche</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-zinc-800 text-white"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Links</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-zinc-800 text-white"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
            />
          </div>
        </section>
      )}
    </main>
  );
}
