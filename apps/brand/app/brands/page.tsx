"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCard from "@/components/PersonaCard";
import { useBrandUser } from "@/lib/brandUser";
import { useShortlist } from "@/lib/shortlist";
import { trpc } from "@/lib/trpcClient";
import type { Creator } from "@/app/data/creators";

export default function BrandsDashboard() {
  const router = useRouter();
  const { user } = useBrandUser();
  const { toggle, inShortlist } = useShortlist(user?.email ?? null);

  const [search, setSearch] = useState("");
  const [tone, setTone] = useState("");
  const [values, setValues] = useState("");
  const [niche, setNiche] = useState("");
  const [persona, setPersona] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");

  const creatorsQuery = trpc.getCreators.useQuery({
    search,
    tone,
    values: values
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    niche,
    persona,
    minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
    maxFollowers: maxFollowers ? parseInt(maxFollowers) : undefined,
  });

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) {
    return null;
  }

  const creators = creatorsQuery.data ?? [];

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Persona Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="Values (comma separated)"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Niche"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Persona"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              placeholder="Min Followers"
              className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
            />
            <input
              type="number"
              value={maxFollowers}
              onChange={(e) => setMaxFollowers(e.target.value)}
              placeholder="Max Followers"
              className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
            />
          </div>
        </div>

        {creators.length === 0 && !creatorsQuery.isLoading ? (
          <p className="text-center text-zinc-400 mt-10">No personas found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((p: Creator) => (
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
