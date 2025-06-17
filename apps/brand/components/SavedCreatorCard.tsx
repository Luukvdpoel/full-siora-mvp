"use client";
import Link from "next/link";
import type { Creator } from "@/app/data/creators";

interface Props {
  creator: Creator;
}

export default function SavedCreatorCard({ creator }: Props) {
  return (
    <div className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {creator.name}
        </h2>
        <span className="text-sm text-gray-500 dark:text-zinc-400">
          {creator.platform}
        </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-zinc-300">{creator.summary}</p>
      {creator.tags && (
        <div className="flex flex-wrap gap-2 mt-1">
          {creator.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 dark:bg-Siora-light text-gray-700 dark:text-zinc-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/creator/${creator.id}/profile`}
        className="mt-3 inline-block bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded shadow"
      >
        View Profile
      </Link>
    </div>
  );
}
