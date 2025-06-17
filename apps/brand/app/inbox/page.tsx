"use client";

import { useState, useEffect } from "react";
import { creators } from "@/app/data/creators";
import { useShortlist } from "@/lib/shortlist";
import { useBrandUser } from "@/lib/brandUser";
import SavedCreatorCard from "@/components/SavedCreatorCard";

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  personaSummary: string;
  timestamp: string;
  status?: 'pending' | 'accepted' | 'declined';
}

export default function InboxPage() {
  const { user } = useBrandUser();
  const { ids } = useShortlist(user?.email ?? null);

  const [tab, setTab] = useState<'saved' | 'applications'>('saved');

  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("");
  const [minER, setMinER] = useState("");
  const [maxER, setMaxER] = useState("");

  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (tab !== 'applications') return;
    async function load() {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setApps(data as Application[]);
        }
      } catch (err) {
        console.error('failed to load applications', err);
      }
    }
    load();
  }, [tab]);

  const savedCreators = creators.filter((c) => ids.includes(c.id));

  const niches = Array.from(new Set(savedCreators.map((c) => c.niche)));
  const vibes = Array.from(new Set(savedCreators.map((c) => c.vibe).filter(Boolean)));

  const filtered = savedCreators.filter((c) => {
    const nicheOk = niche ? c.niche === niche : true;
    const vibeOk = vibe ? c.vibe === vibe : true;
    const minOk = minER ? c.engagementRate >= parseFloat(minER) : true;
    const maxOk = maxER ? c.engagementRate <= parseFloat(maxER) : true;
    return nicheOk && vibeOk && minOk && maxOk;
  });

  async function update(id: string, status: Application['status']) {
    try {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('failed to update', err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Inbox</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setTab('saved')}
            className={`px-3 py-1 rounded border border-Siora-border ${tab === 'saved' ? 'bg-Siora-accent' : ''}`}
          >
            Saved Creators
          </button>
          <button
            onClick={() => setTab('applications')}
            className={`px-3 py-1 rounded border border-Siora-border ${tab === 'applications' ? 'bg-Siora-accent' : ''}`}
          >
            Applications
          </button>
        </div>

        {tab === 'saved' && (
          <>
            <div className="bg-Siora-mid p-4 rounded-xl shadow-Siora-hover space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
                >
                  <option value="">All</option>
                  {niches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Vibe</label>
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
                >
                  <option value="">All</option>
                  {vibes.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Min ER%</label>
                <input
                  type="number"
                  step="0.1"
                  value={minER}
                  onChange={(e) => setMinER(e.target.value)}
                  placeholder="Any"
                  className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Max ER%</label>
                <input
                  type="number"
                  step="0.1"
                  value={maxER}
                  onChange={(e) => setMaxER(e.target.value)}
                  placeholder="Any"
                  className="w-full bg-Siora-light text-white border border-Siora-border p-2 rounded-md"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-zinc-400">No creators saved.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c) => (
                  <SavedCreatorCard key={c.id} creator={c} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'applications' && (
          <div className="space-y-4">
            {apps.map((app) => {
              const creator = creators.find((c) => c.id === app.userId);
              return (
                <div key={app.id} className="bg-Siora-mid border border-Siora-border rounded-xl p-6 shadow-Siora-hover">
                  <h2 className="text-xl font-semibold mb-1">
                    {creator ? creator.name : app.userId}
                  </h2>
                  <p className="text-sm text-zinc-300 mb-2">{creator?.summary ?? app.personaSummary}</p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Status:</label>
                    <select
                      value={app.status ?? 'pending'}
                      onChange={(e) => update(app.id, e.target.value as Application['status'])}
                      className="bg-Siora-light text-white border border-Siora-border p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
              );
            })}
            {apps.length === 0 && (
              <p className="text-center text-zinc-400">No applications.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
