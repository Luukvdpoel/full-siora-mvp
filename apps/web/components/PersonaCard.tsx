'use client';
import React from 'react';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";

type Props = {
  persona: Creator;
  onToggle?: (id: string) => void;
  inShortlist?: boolean;
};

export default function PersonaCard({ persona, onToggle, inShortlist }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/brands/${persona.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="rounded-xl p-6 bg-Siora-mid border border-Siora-border text-white shadow hover:shadow-Siora-hover hover:-translate-y-1 transition cursor-pointer space-y-2"
    >
      <h2 className="text-lg font-semibold text-white mb-1">
        {persona.name}{" "}
        <span className="text-Siora-accent">@{persona.handle}</span>
      </h2>
      <p className="text-sm text-zinc-400 mb-2">
        {persona.tone} • {persona.platform}
      </p>
      <p className="text-sm text-zinc-300 mb-4">
        {persona.summary}
      </p>
      {persona.tags && (
        <div className="flex flex-wrap gap-1 text-xs text-zinc-400 mb-2">
          {persona.tags.map((tag) => (
            <span
              key={tag}
              className="bg-Siora-light/40 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/brands/${persona.id}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-block text-sm mt-4 text-Siora-accent underline hover:text-Siora-accent-soft"
      >
        View Persona
      </Link>
      {onToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(persona.id);
          }}
          className="ml-4 text-sm text-Siora-accent underline"
        >
          {inShortlist ? "Remove from Shortlist" : "Save to Shortlist"}
        </button>
      )}
    </motion.div>
  );
}
