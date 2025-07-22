'use client';
import React from 'react';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import ShortlistItem from "@/components/ShortlistItem";
import { useBrandUser } from "@/lib/brandUser";
import { useShortlist } from "@/lib/shortlist";
import { useCreatorMeta } from "@/lib/creatorMeta";

export default function ShortlistPage() {
  const { user } = useBrandUser();
  const router = useRouter();
  const { ids, toggle } = useShortlist(user?.email ?? null);
  const { notes, status, updateStatus } = useCreatorMeta(user?.email ?? null);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) return null;

  const saved = creators.filter((c) => ids.includes(c.id));

  const exportPdf = async () => {
    const placeholder = "https://placehold.co/80x80";
    const lines: string[] = ["# Shortlist\n"];
    for (const c of saved) {
      lines.push(`## ${c.name} (@${c.handle})`);
      lines.push(`![${c.name}](${(c as any).image || placeholder})`);
      lines.push(`- Followers: ${c.followers.toLocaleString()}`);
      lines.push(`- Engagement: ${c.engagementRate}%`);
      if (c.fitScore !== undefined) lines.push(`- Fit Score: ${c.fitScore}`);
      lines.push("");
    }
    const res = await fetch("/api/export-shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: lines.join("\n") }),
    });
    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shortlist.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (saved.length === 0) return;
    const headers = [
      "id",
      "name",
      "handle",
      "platform",
      "followers",
      "engagementRate",
      "fitScore",
    ];
    const lines = [headers.join(",")];
    for (const c of saved) {
      const row = [
        c.id,
        c.name,
        c.handle,
        c.platform,
        c.followers.toString(),
        c.engagementRate.toString(),
        c.fitScore !== undefined ? String(c.fitScore) : "",
      ];
      lines.push(row.map((v) => `"${v.replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shortlist.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-4xl font-extrabold tracking-tight">My Shortlist</h1>
          <div className="flex items-center gap-4">
            {saved.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportPdf}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                >
                  Export CSV
                </button>
              </>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
              />
              Compare Mode
            </label>
          </div>
        </div>
        {saved.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No creators saved.</p>
        ) : (
          <div
            className={`grid gap-6 ${compare ? "md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {saved.map((c) => (
              <ShortlistItem
                key={c.id}
                creator={c as any}
                note={notes[c.id]}
                userId={user?.email ?? null}
                onDelete={() => toggle(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
