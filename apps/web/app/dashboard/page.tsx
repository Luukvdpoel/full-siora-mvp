'use client';
import React from 'react';

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { creators } from "@/app/data/creators";
import AdvancedFilterBar, { Filters } from "@/components/AdvancedFilterBar";
import CreatorCard from "@/components/CreatorCard";
import { useShortlist } from "@/lib/shortlist";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role;
  const email = session?.user?.email ?? null;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      signIn();
    } else if (!role) {
      router.replace("/select-role");
    }
  }, [status, session, role, router]);

  if (!session || status === "loading") return null;

  if (role === "brand") return <BrandDashboard userEmail={email} />;
  if (role === "creator") return <CreatorDashboard />;

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      Unknown role
    </main>
  );
}

function BrandDashboard({ userEmail }: { userEmail: string | null }) {
  const { toggle, inShortlist } = useShortlist(userEmail);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    platforms: [],
    tones: [],
    vibes: [],
    niches: [],
    formats: [],
    values: [],
    minEngagement: 0,
    maxEngagement: 10,
    minCollabs: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const unique = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as string[];

  const platforms = unique(creators.map((c: any) => c.platform));
  const tones = unique(creators.map((c: any) => c.tone));
  const niches = unique(creators.map((c: any) => c.niche));

  const [platformFilter, setPlatformFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");

  const filtered = creators.filter((c: any) => {
    const matchesQuery = `${c.name} ${c.handle} ${c.niche} ${c.tags.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase());

    const platformMatch =
      filters.platforms.length === 0 || filters.platforms.includes(c.platform);
    const toneMatch = filters.tones.length === 0 || filters.tones.includes(c.tone);
    const vibeMatch = filters.vibes.length === 0 || (c.vibe && filters.vibes.includes(c.vibe));
    const nicheMatch = filters.niches.length === 0 || filters.niches.includes(c.niche);
    const formatMatch =
      filters.formats.length === 0 || (c.formats?.some((f: any) => filters.formats.includes(f)) ?? false);
    const valuesMatch = filters.values.length === 0 || filters.values.some((v) => c.tags.includes(v));
    const erMatch = c.engagementRate >= filters.minEngagement && c.engagementRate <= filters.maxEngagement;
    const collabMatch = (c.completedCollabs ?? 0) >= filters.minCollabs;

    const extraPlatform = !platformFilter || c.platform === platformFilter;
    const extraTone = !toneFilter || c.tone === toneFilter;
    const extraNiche = !nicheFilter || c.niche === nicheFilter;

    return (
      matchesQuery &&
      platformMatch &&
      toneMatch &&
      vibeMatch &&
      nicheMatch &&
      formatMatch &&
      valuesMatch &&
      erMatch &&
      collabMatch &&
      extraPlatform &&
      extraTone &&
      extraNiche
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 md:px-10 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Brand Dashboard</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search creators..."
          className="w-full p-3 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Platforms</option>
            {platforms.map((p: string) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={toneFilter}
            onChange={(e) => setToneFilter(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Tones</option>
            {tones.map((t: string) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="">All Niches</option>
            {niches.map((n: string) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <AdvancedFilterBar onFilter={setFilters} />

        {paginated.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">No creators match your filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((c: any) => (
            <CreatorCard
              key={c.id}
              creator={c}
              onShortlist={toggle}
              shortlisted={inShortlist(c.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-8 border-t border-Siora-border mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1 rounded-md border border-Siora-border text-sm transition ${
                page === currentPage
                  ? "bg-Siora-accent text-white font-semibold"
                  : "text-zinc-300 hover:bg-Siora-accent hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function CreatorDashboard() {
  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 md:px-10 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Creator Dashboard</h1>
        <section className="border border-Siora-border rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Persona Status</h2>
          <p className="text-zinc-300">Manage your persona to attract brands.</p>
        </section>
        <section className="border border-Siora-border rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Brand Matches</h2>
          <p className="text-zinc-300">View brands that match your persona.</p>
        </section>
        <section className="border border-Siora-border rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Feedback</h2>
          <p className="text-zinc-300">Check feedback from recent collaborations.</p>
        </section>
      </div>
    </main>
  );
}
