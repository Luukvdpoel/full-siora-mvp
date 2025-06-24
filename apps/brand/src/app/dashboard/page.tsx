"use client";

import { useState } from "react";
import CreatorCard from "@/components/CreatorCard";
import { trpc } from "@/lib/trpcClient";
import type { CreatorProfile } from "@prisma/client";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("");
  const [values, setValues] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [niche, setNiche] = useState("");
  const [persona, setPersona] = useState("");

  const { data: creators } = trpc.searchCreators.useQuery(
    {
      query,
      tone,
      niche,
      persona,
      minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
      maxFollowers: maxFollowers ? parseInt(maxFollowers) : undefined,
      values: values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0),
    },
    { keepPreviousData: true }
  );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Creator Personas</h1>
      <input
        className="p-2 w-full border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
        placeholder="Search creators"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Values (comma separated)"
          value={values}
          onChange={(e) => setValues(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
        <input
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Persona"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Min followers"
          value={minFollowers}
          onChange={(e) => setMinFollowers(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border"
          placeholder="Max followers"
          value={maxFollowers}
          onChange={(e) => setMaxFollowers(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(creators || []).map((creator: CreatorProfile & any) => (
          <CreatorCard key={creator.id} creator={creator as any} />
        ))}
        {(!creators || creators.length === 0) && (
          <p className="col-span-full text-center text-gray-500 dark:text-zinc-400">No personas found.</p>
        )}
      </div>
    </div>
  );
}
