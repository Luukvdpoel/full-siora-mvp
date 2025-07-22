'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { creators } from '@/app/data/creators';
import { campaigns } from '@/app/data/campaigns';
import type { PitchFeedback } from '@/types/pitch';

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  personaSummary: string;
  pitch?: string;
  status: string;
  timestamp: string;
}

export default function ApplicationsPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;
  const campaign = campaigns.find((c) => c.id === campaignId);
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [toast, setToast] = useState('');
  const [feedback, setFeedback] = useState<Record<string, PitchFeedback | null>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/applications`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setApps(data as Application[]);
        }
      } catch (err) {
        console.error('failed to load applications', err);
      }
    }
    if (campaignId) load();
  }, [campaignId]);

  async function accept(application: Application) {
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          creatorId: application.userId,
          applicationId: application.id,
        }),
      });
      setApps((prev) => prev.filter((a) => a.id !== application.id));
      setToast('Application accepted');
      router.push(`/campaigns/${campaignId}/messages/${application.userId}`);
    } catch {
      setToast('Failed to accept');
    }
  }

  function reject(id: string) {
    setApps((prev) => prev.filter((a) => a.id !== id));
    setToast('Application rejected');
  }

  async function analyze(app: Application) {
    if (!campaign) return;
    setFeedback((prev) => ({ ...prev, [app.id]: null }));
    try {
      const res = await fetch('/api/pitchFeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitch: app.pitch,
          personaSummary: app.personaSummary,
          brand: campaign,
        }),
      });
      if (res.ok) {
        const data: PitchFeedback = await res.json();
        setFeedback((prev) => ({ ...prev, [app.id]: data }));
      }
    } catch (err) {
      console.error('analysis error', err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold">Campaign Applications</h1>
        {apps.length === 0 ? (
          <p className="text-center text-zinc-400">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => {
              const creator = creators.find((c) => c.id === app.userId);
              return (
                <div key={app.id} className="bg-Siora-mid border border-Siora-border rounded-xl p-6 shadow-Siora-hover">
                  <h2 className="text-xl font-semibold">
                    {creator ? (
                      <Link href={`/dashboard/persona/${creator.handle.replace(/^@/, '')}`} className="text-Siora-accent underline">
                        {creator.name}
                      </Link>
                    ) : (
                      app.userId
                    )}
                  </h2>
                  {app.pitch && <p className="text-sm mb-2">{app.pitch}</p>}
                  <p className="text-sm text-zinc-300 mb-2">{app.personaSummary}</p>
                  <p className="text-sm text-zinc-400 mb-1">Status: {app.status}</p>
                  <p className="text-sm text-zinc-400 mb-4">{new Date(app.timestamp).toLocaleString()}</p>
                  <div className="flex gap-4">
                    <button onClick={() => accept(app)} className="px-3 py-1 text-sm rounded bg-green-600 text-white">Accept</button>
                    <button onClick={() => reject(app.id)} className="px-3 py-1 text-sm rounded bg-red-600 text-white">Reject</button>
                    {app.pitch && (
                      <button
                        onClick={() => analyze(app)}
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
                      >
                        AI Feedback
                      </button>
                    )}
                  </div>
                  {feedback[app.id] && (
                    <div className="mt-3 p-3 rounded bg-Siora-dark text-sm space-y-1">
                      <p>{feedback[app.id]?.fitSummary}</p>
                      <ul className="list-disc pl-5">
                        {feedback[app.id]?.adjustments.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                      <p>
                        Strength: {feedback[app.id]?.ratings.strength}/5 | Clarity:{' '}
                        {feedback[app.id]?.ratings.clarity}/5 | Uniqueness:{' '}
                        {feedback[app.id]?.ratings.uniqueness}/5
                      </p>
                      {feedback[app.id]?.tags.length > 0 && (
                        <p>Issues: {feedback[app.id]?.tags.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </main>
  );
}
