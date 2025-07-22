"use client";
import React from 'react';
import { useEffect, useState } from "react";
import Link from "next/link";
import campaigns from "@/app/creator/data/campaigns";

interface Application {
  id: string;
  campaignId: string;
  pitch: string;
  personaSummary: string;
  timestamp: string;
}

interface MyCampaign extends Application {
  status: string;
  lastUpdate: string;
}

const creatorId = "1"; // demo user

export default function MyCampaignsPage() {
  const [items, setItems] = useState<MyCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/campaign-applications");
        if (res.ok) {
          const apps: Application[] = await res.json();
          const enriched = await Promise.all(
            apps.map(async (app) => {
              let status = "Applied";
              let lastUpdate = app.timestamp;

              try {
                const mRes = await fetch(`/api/matches?campaignId=${app.campaignId}`);
                if (mRes.ok) {
                  const matches = await mRes.json();
                  const match = (matches as any[]).find((m) => m.creatorId === creatorId);
                  if (match) {
                    status = "Matched";
                    lastUpdate = match.timestamp;
                  }
                }
              } catch {}

              try {
                const msgRes = await fetch(
                  `/api/messages?creatorId=${creatorId}&campaign=${app.campaignId}`
                );
                if (msgRes.ok) {
                  const data = await msgRes.json();
                  if (Array.isArray(data.messages) && data.messages.length > 0) {
                    const latest = data.messages.reduce((prev: any, cur: any) =>
                      new Date(cur.timestamp) > new Date(prev.timestamp) ? cur : prev
                    );
                    if (new Date(latest.timestamp) > new Date(lastUpdate)) {
                      lastUpdate = latest.timestamp;
                    }
                  }
                }
              } catch {}

              return { ...app, status, lastUpdate } as MyCampaign;
            })
          );
          setItems(enriched);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Campaigns</h1>
      {items.length === 0 ? (
        <p className="text-foreground/60">{loading ? "Loading..." : "No campaigns found."}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const c = campaigns.find((c) => c.id === item.campaignId);
            return (
              <div key={item.id} className="border border-white/10 p-4 rounded-lg space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {c?.title ?? item.campaignId}
                  {item.status === "Matched" && (
                    <Link
                      href={`/campaigns/${item.campaignId}/messages`}
                      className="text-indigo-600 hover:text-indigo-400"
                      aria-label="Message brand"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M4 4h16v10H7l-4 4V4z" />
                      </svg>
                    </Link>
                  )}
                </h2>
                <p className="text-sm text-foreground/80">{c?.brand}</p>
                <p className="text-sm capitalize">Status: {item.status}</p>
                <p className="text-xs text-foreground/60">
                  Last update: {new Date(item.lastUpdate).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
