"use client";
import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";

interface Props {
  creator: Creator;
  score?: number;
  reason?: string;
  onClick?: () => void;
}

export default function SavedCreatorCard({ creator, score, reason, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {creator.name}
      </h3>
      {typeof score === "number" && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Match Score: {score}/100
        </p>
      )}
      {reason && (
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1">
          {reason}
        </p>
      )}
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1">
        {creator.platform}
      </p>
      <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
        {creator.summary}
      </p>
      {creator.tags && (
        <div className="flex flex-wrap gap-1 mb-4">
          {creator.tags.map((t) => (
            <span
              key={t}
              className="bg-gray-100 dark:bg-Siora-light text-gray-700 dark:text-zinc-300 rounded px-2 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/dashboard/persona/${creator.handle.replace(/^@/, "")}`}
        className="text-sm text-Siora-accent underline"
      >
        View Profile
      </Link>
    </motion.div>
  );
}
