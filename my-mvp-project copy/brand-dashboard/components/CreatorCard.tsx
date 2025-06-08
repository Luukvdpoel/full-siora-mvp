"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="bg-nura-mid border border-nura-border rounded-2xl p-6 shadow-nura-hover hover:-translate-y-1 transition-all"
>
  <h2 className="text-lg font-semibold text-white mb-1">
    {creator.name}{" "}
    <span className="text-nura-accent">@{creator.handle}</span>
  </h2>
  <p className="text-sm text-zinc-400 mb-2">{creator.niche} • {creator.platform}</p>
  <p className="text-sm text-zinc-300 mb-4">{creator.summary}</p>
  <div className="flex items-center text-xs text-zinc-400 space-x-4">
    <span>{creator.followers.toLocaleString()} followers</span>
    <span>{creator.engagementRate}% ER</span>
  </div>
  <Link
    href={`/creator/${creator.id}`}
    className="inline-block text-sm mt-4 text-nura-accent underline hover:text-indigo-400"
  >
    View Profile
  </Link>
</motion.div>
  );
}



  