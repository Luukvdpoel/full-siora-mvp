"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {creator.name}{" "}
        <span className="text-Siora-accent group-hover:text-Siora-accent-soft">
          @{creator.handle}
        </span>
      </h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
        {creator.niche} • {creator.platform}
      </p>
      <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">
        {creator.summary}
      </p>
      <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 space-x-4">
        <span>{creator.followers.toLocaleString()} followers</span>
        <span>{creator.engagementRate}% ER</span>
      </div>
      <Link
        href={`/dashboard/persona/${creator.handle.replace(/^@/, "")}`}
        className="inline-block text-sm mt-4 text-Siora-accent underline group-hover:text-Siora-accent-soft"
      >
        View
      </Link>
    </motion.div>
  );
}



  