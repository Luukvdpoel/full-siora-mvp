"use client";
import { FaTrash } from "react-icons/fa";
import type { Creator } from "@/app/data/creators";

interface Props {
  creator: Creator;
  note?: string;
  onDelete?: () => void;
}

export default function ShortlistItem({ creator, note, onDelete }: Props) {
  const imgSrc = (creator as any).image || "https://placehold.co/80x80";
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
        {note && (
          <p className="text-sm text-gray-700 dark:text-zinc-300 mt-2 line-clamp-3">
            {note}
          </p>
        )}
      </div>
      {onDelete && (
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 self-start">
          <FaTrash />
        </button>
      )}
    </div>
  );
}
