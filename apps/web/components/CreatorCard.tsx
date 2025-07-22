"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Creator } from "@/app/data/creators";
import { useState, useMemo, ReactNode } from "react";
import { Badge } from "shared-ui";
import { getCreatorBadges, generateMatchExplanation } from "shared-utils";

import { FaEnvelope, FaRegStar, FaStar } from "react-icons/fa";
import { useBrandUser } from "@/lib/brandUser";
import { useBrandPrefs } from "@/lib/brandPrefs";
import Toast from "./Toast";

import EvaluationChecklistModal from "./EvaluationChecklistModal";

type Props = {
  creator: Creator;
  onShortlist?: (id: string) => void;
  shortlisted?: boolean;
  children?: ReactNode;
};
export default function CreatorCard({ creator, onShortlist, shortlisted, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [toast, setToast] = useState("");
  const { user } = useBrandUser();
  const brandPrefs = useBrandPrefs();
  const badges = getCreatorBadges({
    verified: creator.verified,
    completedCollabs: creator.completedCollabs,
    avgResponseMinutes: creator.avgResponseMinutes,
  });

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

  const handleSave = () => {
    if (onShortlist) onShortlist(creator.id);
    if (shortlisted) {
      setToast('Removed from shortlist');
    } else {
      setToast('Creator saved to shortlist');
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/persona/${creator.handle.replace(/^@/, "")}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer bg-white dark:bg-Siora-mid border border-gray-300 dark:border-Siora-border rounded-2xl p-6 shadow-Siora-hover"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
        {creator.name}{" "}
        <span className="text-Siora-accent group-hover:text-Siora-accent-soft">
          @{creator.handle}
        </span>
        {badges.map((b) => (
          <Badge key={b.id} label={b.label} />
        ))}
      </h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
        {creator.niche} • {creator.platform}
      </p>
      <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">
        {creator.summary}
      </p>
      {matchNotes.length > 0 && (
        <div className="mb-2 text-xs text-gray-600 dark:text-zinc-400">
          <span className="font-semibold">Why this match:</span>
          <ul className="list-disc list-inside">
            {matchNotes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {creator.tags && (
        <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-zinc-400 mb-2">
          {creator.tags.map((tag) => (
            <span
              key={tag}
              className="bg-Siora-light dark:bg-Siora-dark px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 space-x-4">
        <span>{creator.followers.toLocaleString()} followers</span>
        <span>{creator.engagementRate}% ER</span>
      </div>
      <Link
        href={`/dashboard/persona/${creator.handle.replace(/^@/, "")}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-block text-sm mt-4 text-Siora-accent underline group-hover:text-Siora-accent-soft"
      >
        View
      </Link>
      <Link
        href={`/messages/${creator.id}`}
        onClick={(e) => e.stopPropagation()}
        className="ml-4 inline-flex items-center text-sm mt-4 text-white bg-Siora-accent rounded px-3 py-1 hover:bg-Siora-accent-soft"
      >
        <FaEnvelope className="mr-1" /> Message
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleContact();
        }}
        disabled={loading}
        className="ml-4 inline-block text-sm mt-4 text-white bg-Siora-accent rounded px-3 py-1 disabled:opacity-50"
      >
        {loading ? 'Contacting...' : 'Contact'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setChecklistOpen(true);
        }}
        className="ml-4 text-sm mt-4 text-Siora-accent underline"
      >
        Generate Evaluation Checklist
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSave();
        }}
        className={`ml-4 mt-4 text-sm flex items-center gap-1 underline ${
          shortlisted ? 'text-yellow-400' : 'text-Siora-accent'
        }`}
      >
        {shortlisted ? <FaStar /> : <FaRegStar />} {shortlisted ? 'Saved' : 'Save'}
      </button>
      {children}
      <EvaluationChecklistModal
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        creatorId={creator.id}
        creatorName={creator.name}
      />
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </motion.div>
  );
}



  