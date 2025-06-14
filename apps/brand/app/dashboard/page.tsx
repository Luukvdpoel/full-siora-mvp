"use client";

import { useState } from "react";
import creators from "@/app/data/mock_creators_200.json";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import CreatorCard from "@/components/CreatorCard";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const filtered = creators
    .filter((c) => {
      const matchesQuery = `${c.name} ${c.handle} ${c.niche} ${c.tags.join(" ")} ${c.tone}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFilters =
        (!filters.niche || c.niche.toLowerCase().includes(filters.niche.toLowerCase())) &&
        (!filters.platform || c.platform.toLowerCase().includes(filters.platform.toLowerCase())) &&
        (!filters.minFollowers || c.followers >= parseInt(filters.minFollowers)) &&
        (!filters.maxFollowers || c.followers <= parseInt(filters.maxFollowers));

      return matchesQuery && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "followers-asc":
          return a.followers - b.followers;
        case "followers-desc":
          return b.followers - a.followers;
        case "engagement-asc":
          return a.engagementRate - b.engagementRate;
        case "engagement-desc":
          return b.engagementRate - a.engagementRate;
        default:
          return 0;
      }
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

        <FilterBar onFilter={setFilters} onSort={setSortBy} />

        {paginated.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">No creators match your filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((c) => (
            <CreatorCard key={c.id} creator={c} />
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





