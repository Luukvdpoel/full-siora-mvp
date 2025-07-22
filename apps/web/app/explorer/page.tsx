import React from 'react';
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PersonaCard from "@/components/PersonaCard";
import CreatorFilters from "@/components/CreatorFilters";
import { fetchCreators, getFilterOptions } from "./actions";

export default function ExplorerPage() {
  const [tones, setTones] = useState<string[]>([]);
  const [personaTypes, setPersonaTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ tone: string; personaTypes: string[] }>({ tone: "", personaTypes: [] });
  const [sort, setSort] = useState<"match" | "name">("match");
  const [page, setPage] = useState(1);
  const [creators, setCreators] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getFilterOptions().then((d) => {
      setTones(d.tones);
      setPersonaTypes(d.personaTypes);
    });
  }, []);

  useEffect(() => {
    fetchCreators({ ...filters, sort, page }).then((d) => {
      setCreators(d.creators);
      setTotal(d.total);
    });
  }, [filters, sort, page]);

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold tracking-tight"
        >
          Persona Explorer
        </motion.h1>

        <CreatorFilters
          tones={tones}
          personaTypes={personaTypes}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "match" | "name");
              setPage(1);
            }}
            className="p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          >
            <option value="match">Match Score</option>
            <option value="name">Name</option>
          </select>
        </div>

        {creators.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No personas match.</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((p) => {
              const persona = {
                id: p.id,
                name: p.name,
                handle: p.handle,
                tone: p.tone,
                platform: "Instagram",
                summary: p.brandPersona || "",
                tags: Array.isArray(p.values) ? p.values : [],
                followers: p.followers,
                engagementRate: 0,
                niche: p.niche,
              };
              return <PersonaCard key={p.id} persona={persona as any} />;
            })}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-Siora-accent rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-Siora-accent rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
