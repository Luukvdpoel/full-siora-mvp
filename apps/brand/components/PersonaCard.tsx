"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";

type Props = {
  persona: Creator;
  onToggle?: (id: string) => void;
  inShortlist?: boolean;
};

export default function PersonaCard({ persona, onToggle, inShortlist }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover hover:-translate-y-1 transition-all"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {persona.name}{" "}
        <span className="text-Siora-accent">@{persona.handle}</span>
      </h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
        {persona.tone} • {persona.platform}
      </p>
      <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">
        {persona.summary}
      </p>
      {persona.tags && (
        <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-zinc-400 mb-2">
          {persona.tags.map((tag) => (
            <span
              key={tag}
              className="bg-Siora-light dark:bg-Siora-dark px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/brands/${persona.id}`}
        className="inline-block text-sm mt-4 text-Siora-accent underline hover:text-indigo-400"
      >
        View Persona
      </Link>
      {onToggle && (
        <button
          onClick={() => onToggle(persona.id)}
          className="ml-4 text-sm text-Siora-accent underline"
        >
          {inShortlist ? "Remove from Shortlist" : "Save to Shortlist"}
        </button>
      )}
    </motion.div>
  );
}
