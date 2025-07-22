"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Brief {
  id: string;
  name: string;
  summary: { mission: string };
}

export default function DashboardPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);

  useEffect(() => {
    fetch("/api/briefs")
      .then((res) => res.json())
      .then((data) => setBriefs(Array.isArray(data) ? data : []));
  }, []);

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Your Campaign Briefs</h1>
      {briefs.length === 0 ? (
        <p>No briefs yet.</p>
      ) : (
        <div className="space-y-4">
          {briefs.map((b) => (
            <div key={b.id} className="bg-Siora-mid p-4 rounded space-y-2">
              <h2 className="text-xl font-semibold">{b.name}</h2>
              <div
                className="prose prose-invert"
                dangerouslySetInnerHTML={{ __html: b.summary.mission }}
              />
              <Link
                href="/shortlist"
                className="inline-block mt-2 px-3 py-1 bg-Siora-accent rounded"
              >
                Match me with creators
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
