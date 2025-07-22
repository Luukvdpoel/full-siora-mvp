"use client";
import { useState } from "react";
import Link from "next/link";
import personas from "@/app/data/mock_creators_200.json";
import { notFound } from "next/navigation";
import PerformanceTab from "@/components/PerformanceTab";

export default function PersonaProfile({ params }: any) {
  const persona = personas.find((p) => p.id.toString() === params.id);
  if (!persona) return notFound();

  const [tab, setTab] = useState<'overview' | 'performance'>('overview');

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border border-Siora-border rounded-2xl bg-Siora-mid p-6 shadow-Siora-hover">
          <h1 className="text-3xl font-bold tracking-tight">
            {persona.name}{" "}
            <span className="text-Siora-accent">
              {persona.handle.startsWith("@") ? persona.handle : `@${persona.handle}`}
            </span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {persona.tone} • {persona.platform}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setTab('overview')}
              className={tab === 'overview' ? 'px-3 py-1 rounded bg-Siora-accent' : 'px-3 py-1 rounded bg-Siora-light'}
            >
              Overview
            </button>
            <button
              onClick={() => setTab('performance')}
              className={tab === 'performance' ? 'px-3 py-1 rounded bg-Siora-accent' : 'px-3 py-1 rounded bg-Siora-light'}
            >
              Performance
            </button>
          </div>

          {tab === 'overview' && (
            <>
              <p className="mt-4 text-zinc-300 leading-relaxed">{persona.summary}</p>
              <div className="mt-6 space-y-2 text-sm text-zinc-300">
                <div>
                  <strong>Followers:</strong> {persona.followers.toLocaleString()}
                </div>
                <div>
                  <strong>Engagement Rate:</strong> {persona.engagementRate}%
                </div>
              </div>
              {persona.tags && (
                <div className="mt-6">
                  <h2 className="text-md font-semibold mb-2">Vibes</h2>
                  <div className="flex flex-wrap gap-2">
                    {persona.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-Siora-light text-white border border-Siora-border px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {tab === 'performance' && <PerformanceTab creatorId={persona.id.toString()} />}
          <Link
            href={`/feedback/${persona.id}`}
            className="mt-4 inline-block px-3 py-1 bg-gray-700 text-white rounded"
          >
            Leave/View Feedback
          </Link>
        </div>
      </div>
    </main>
  );
}
