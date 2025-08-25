"use client";
import * as React from "react";
import { CreatorCard } from "@/components/CreatorCard";
import { FilterBar, type FilterState } from "@/components/FilterBar";

type CreatorFromServer = {
  id: string;
  name: string;
  handle: string;
  niche: string | null;
  tone: string | null;
  values: string[];
  followers: number;
  avgViews: number;
  engagement: number | null;
  location: string | null;
};

export default function DashboardClient({ initialCreators }: { initialCreators: CreatorFromServer[] }) {
  React.useEffect(() => {
    fetch("/api/provision", { method: "POST" }).catch(() => {});
  }, []);

  const [filters, setFilters] = React.useState<FilterState>({
    q: "",
    tone: "Any",
    niche: "Any",
    minFollowers: 0,
    maxFollowers: 1_000_000,
    verifiedOnly: false,
    sort: "match",
  });

  const items = React.useMemo(() => {
    let list = initialCreators.map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      niche: c.niche ?? "—",
      tone: (c.tone as any) ?? "—",
      values: c.values ?? [],
      followers: c.followers,
      avgViews: c.avgViews,
      er: c.engagement ?? undefined,
      location: c.location ?? undefined,
      matchScore: undefined,
    }));

    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q)
      );
    }
    if (filters.tone !== "Any") list = list.filter((c) => c.tone === filters.tone);
    if (filters.niche !== "Any") list = list.filter((c) => c.niche === filters.niche);
    list = list.filter((c) => c.followers >= filters.minFollowers && c.followers <= filters.maxFollowers);

    switch (filters.sort) {
      case "followers":
        list.sort((a, b) => b.followers - a.followers);
        break;
      case "engagement":
        list.sort((a, b) => (b.er ?? 0) - (a.er ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [filters, initialCreators]);

  return (
    <section className="py-8">
      <h1 className="text-2xl font-semibold">Creator Discovery</h1>
      <p className="mt-1 text-white/60">Filter by tone, values, niche, and audience size.</p>

      <div className="mt-5">
        <FilterBar value={filters} onChange={setFilters} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <CreatorCard key={c.id} data={c as any} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No creators match your filters.
          </div>
        )}
      </div>
    </section>
  );
}

