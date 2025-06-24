"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpcClient";
import PersonaCard from "@/components/PersonaCard";
import { useBrandUser } from "@/lib/brandUser";
import { useShortlist } from "@/lib/shortlist";
import type { Creator } from "@prisma/client";

type Persona = Creator;

export default function BrandsDashboard() {
  const router = useRouter();
  const { user } = useBrandUser();
  const { toggle, inShortlist } = useShortlist(user?.email ?? null);

  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [vibe, setVibe] = useState("");
  const [niche, setNiche] = useState("");
  const [tag, setTag] = useState("");
  const [format, setFormat] = useState("");

  useEffect(() => {
    if (!user) router.replace('/signin');
  }, [user, router]);

  if (!user) {
    return null;
  }

  const { data: filtered = [], isLoading } = trpc.filterCreators.useQuery({
    query: '',
    tone,
    platform,
    niche,
    persona: vibe,
    values: tag ? [tag] : [],
  });

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Persona Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Search tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Search platform"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Search vibe"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Search niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tone tag"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="Format"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
        </div>

        {isLoading && (
          <p className="text-center text-zinc-400 mt-10">Loading creators...</p>
        )}
        {filtered.length === 0 && !isLoading ? (
          <p className="text-center text-zinc-400 mt-10">No personas found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p: Persona) => (
              <PersonaCard
                key={p.id}
                persona={p}
                onToggle={toggle}
                inShortlist={inShortlist(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
