import React from 'react';
"use client";

import { useState } from "react";
import collabs from "@/app/creator/data/collabs";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending payment", label: "Pending Payment" },
  { value: "completed", label: "Completed" },
];

export default function CollabsPage() {
  const [status, setStatus] = useState<string>("all");

  const filtered = collabs.filter(
    (c) => status === "all" || c.status === status
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Collaborations</h1>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 rounded-md border bg-background border-white/10"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="border border-white/10 p-4 rounded-lg space-y-1"
          >
            <h2 className="text-lg font-semibold">{c.brand}</h2>
            <p className="text-sm">{c.campaign}</p>
            <p className="text-sm">Earnings: ${c.earnings}</p>
            <p className="text-sm capitalize">Status: {c.status}</p>
            {c.rating && (
              <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < (c.rating ?? 0) ? "\u2605" : "\u2606"}</span>
                ))}
              </div>
            )}
            {c.review && (
              <p className="text-sm italic text-foreground/80">{c.review}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
