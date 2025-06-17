"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";
import { useState } from "react";

import { ReactNode } from "react";

type Props = {
  creator: Creator;
  onShortlist?: (id: string) => void;
  shortlisted?: boolean;
  children?: ReactNode;
};
export default function CreatorCard({ creator, onShortlist, shortlisted, children }: Props) {
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: creator.id,
          brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Demo Brand',
        }),
      });
      const data = await res.json();
      if (data.message) {
        alert(data.message);
      } else {
        alert('Failed to generate message');
      }
    } catch {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

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
      <button
        onClick={handleContact}
        disabled={loading}
        className="ml-4 inline-block text-sm mt-4 text-white bg-Siora-accent rounded px-3 py-1 disabled:opacity-50"
      >
        {loading ? 'Contacting...' : 'Contact'}
      </button>
      {onShortlist && (
        <button
          onClick={() => onShortlist(creator.id)}
          className="ml-4 text-sm mt-4 text-Siora-accent underline"
        >
          {shortlisted ? 'Remove from Shortlist' : 'Save to Shortlist'}
        </button>
      )}
      {children}
    </motion.div>
  );
}



  