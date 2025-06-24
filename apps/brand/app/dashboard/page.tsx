"use client";

import { useState } from "react";
import AdvancedFilterBar, { Filters } from "@/components/AdvancedFilterBar";
import CreatorCard from "@/components/CreatorCard";
import { useSession } from "next-auth/react";
import { useShortlist } from "@/lib/shortlist";
import { trpc } from "@/lib/trpcClient";

export default function Dashboard() {
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
  const { data: session } = useSession();
  const user = session?.user?.email ?? null;
  const { toggle, inShortlist } = useShortlist(user);

  const { data: creators = [], isLoading } = trpc.filterCreators.useQuery({
    query,
    tone: toneFilter,
    platform: platformFilter,
    niche: nicheFilter,
    values: filters.values,
    persona: filters.vibes[0],
  });

  const unique = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as string[];

  const platforms = unique(creators.map((c) => c.platform));
  const tones = unique(creators.map((c) => c.tone));
  const niches = unique(creators.map((c) => c.niche));

  const [platformFilter, setPlatformFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");

  const filtered = creators;

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
            {platforms.map((p) => (
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
            {tones.map((t) => (
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
            {niches.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <AdvancedFilterBar
          onFilter={setFilters}
          platforms={platforms}
          tones={tones}
          niches={niches}
        />

        {isLoading && (
          <p className="text-center text-zinc-400 mt-10">Loading creators...</p>
        )}
        {paginated.length === 0 && !isLoading && (
          <p className="text-center text-zinc-400 mt-10">No creators match your filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((c) => (
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





