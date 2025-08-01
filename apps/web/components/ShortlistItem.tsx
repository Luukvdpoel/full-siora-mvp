'use client';
import React from 'react';
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import type { Creator } from "@/app/data/creators";
import { useMemo } from "react";
import { generateMatchExplanation } from "shared-utils";
import { useBrandPrefs } from "@/lib/brandPrefs";
import { useCreatorMeta, CollabStatus } from "@/lib/creatorMeta";

interface Props {
  creator: Creator;
  note?: string;
  onDelete?: () => void;
  userId?: string | null;
}

export default function ShortlistItem({ creator, note, onDelete, userId }: Props) {
  const imgSrc = (creator as any).image || "https://placehold.co/80x80";
  const brandPrefs = useBrandPrefs();
  const { status, updateStatus } = useCreatorMeta(userId ?? null);
  const currentStatus: CollabStatus = status[creator.id] || 'new';
  const matchNotes = useMemo(() => {
    if (!brandPrefs) return [] as string[];
    const persona = {
      niches: [creator.niche],
      tone: creator.tone,
      platforms: [creator.platform],
      vibe: Array.isArray(creator.tags) ? creator.tags.join(' ') : undefined,
    };
    return generateMatchExplanation(brandPrefs, persona);
  }, [brandPrefs, creator]);
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl shadow-Siora-hover">
      <img src={imgSrc} alt={creator.name} className="w-20 h-20 rounded object-cover" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {creator.name}
        </h3>
        {creator.tags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {creator.tags.map((t) => (
              <span key={t} className="bg-gray-100 dark:bg-Siora-light text-gray-700 dark:text-zinc-300 rounded px-2 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        )}
        {matchNotes.length > 0 && (
          <div className="mt-2 text-xs text-gray-600 dark:text-zinc-400">
            <span className="font-semibold">Why this match:</span>
            <ul className="list-disc list-inside">
              {matchNotes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {note && (
          <p className="text-sm text-gray-700 dark:text-zinc-300 mt-2 line-clamp-3">
            {note}
          </p>
        )}
        <Link
          href={`/brands/${creator.id}`}
          className="block mt-2 text-sm text-Siora-accent underline"
        >
          View Persona
        </Link>
        <select
          className="mt-2 text-sm text-black rounded"
          value={currentStatus}
          onChange={(e) => updateStatus(creator.id, e.target.value as CollabStatus)}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="not_fit">Not a fit</option>
        </select>
      </div>
      {onDelete && (
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 self-start">
          <FaTrash />
        </button>
      )}
    </div>
  );
}
