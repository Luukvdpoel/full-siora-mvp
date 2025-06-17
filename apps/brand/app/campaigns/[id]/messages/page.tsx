"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";

interface Match {
  id: string;
  campaignId: string;
  creatorId: string;
  timestamp: string;
}

export default function CampaignMessagesPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/matches?campaignId=${campaignId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setMatches(data as Match[]);
        }
      } catch (err) {
        console.error("failed to load matches", err);
      }
    }
    if (campaignId) load();
  }, [campaignId]);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Campaign Threads</h1>
        <ul className="space-y-2">
          {matches.map((m) => {
            const creator = creators.find((c) => c.id === m.creatorId);
            return (
              <li key={m.id}>
                <Link
                  href={`/campaigns/${campaignId}/messages/${m.creatorId}`}
                  className="text-Siora-accent underline"
                >
                  {creator ? creator.name : m.creatorId}
                </Link>
              </li>
            );
          })}
          {matches.length === 0 && (
            <li className="text-zinc-400">No matches yet.</li>
          )}
        </ul>
      </div>
    </main>
  );
}
