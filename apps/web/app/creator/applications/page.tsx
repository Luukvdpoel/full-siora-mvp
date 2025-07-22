import React from 'react';
"use client";
import { useEffect, useState } from "react";
import campaigns from "@/app/creator/data/campaigns";
import { Spinner } from "shared-ui";

interface Application {
  id: string;
  campaignId: string;
  pitch?: string;
  personaSummary?: string;
  status: string;
  timestamp: string;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/campaign-applications");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setApps(data as Application[]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Applications</h1>
      {apps.length === 0 ? (
        loading ? (
          <Spinner />
        ) : (
          <p className="text-foreground/60">No applications found.</p>
        )
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const c = campaigns.find((c) => c.id === a.campaignId);
            return (
              <div key={a.id} className="border border-white/10 p-4 rounded-lg space-y-2">
                <h2 className="text-lg font-semibold">{c?.title ?? a.campaignId}</h2>
                <p className="text-sm text-foreground/80">{c?.brand}</p>
                <p className="text-sm">{a.pitch}</p>
                <p className="text-xs text-foreground/60">Status: {a.status}</p>
                <p className="text-xs text-foreground/60">{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
