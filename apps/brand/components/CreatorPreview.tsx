"use client";

import { motion } from "framer-motion";
import type { Creator } from "@prisma/client";

const platformIcons: Record<string, string> = {
  Instagram: "\uD83D\uDCF8",
  TikTok: "\uD83C\uDFB5",
  YouTube: "\u25B6\uFE0F",
  Twitter: "\uD83D\uDD4A\uFE0F",
};

type Props = {
  creator: Creator;
};

export default function CreatorPreview({ creator }: Props) {
  const icon = platformIcons[creator.platform] || "\uD83D\uDC64";
  const hooks = creator.formats ? creator.formats.slice(0, 2) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-5 shadow-Siora-hover"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {creator.handle}
        </h3>
        <span className="text-xl" aria-label={creator.platform} title={creator.platform}>
          {icon}
        </span>
      </div>
      {creator.vibe && (
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
          {creator.vibe}
        </p>
      )}
      {hooks.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 text-xs">
          {hooks.map((h) => (
            <span
              key={h}
              className="bg-gray-100 dark:bg-Siora-light text-gray-700 dark:text-zinc-300 rounded px-2 py-1"
            >
              {h}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
        {creator.followers.toLocaleString()} followers
        {typeof creator.engagementRate === "number" && (
          <> • {creator.engagementRate}% ER</>
        )}
        {creator.location && <> • {creator.location}</>}
      </div>
      {typeof creator.fitScore === "number" && (
        <p className="text-sm font-semibold text-Siora-accent">
          Fit Score: {creator.fitScore}
        </p>
      )}
    </motion.div>
  );
}
