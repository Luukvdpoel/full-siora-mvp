"use client";
import { useEffect, useState, useMemo } from 'react';
import type { Campaign } from '@/app/creator/data/campaigns';
import CampaignCard from '@creator/components/CampaignCard';

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [platform, setPlatform] = useState('');
  const [niche, setNiche] = useState('');
  const [payout, setPayout] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchPlatform = !platform || c.platform.toLowerCase().includes(platform.toLowerCase());
      const matchNiche = !niche || c.niche.toLowerCase().includes(niche.toLowerCase());
      const pay = parseInt(payout || '0', 10);
      const matchPay = !payout || c.budgetMax >= pay;
      return matchPlatform && matchNiche && matchPay;
    });
  }, [campaigns, platform, niche, payout]);

  const platforms = useMemo(() => Array.from(new Set(campaigns.map(c => c.platform))), [campaigns]);
  const niches = useMemo(() => Array.from(new Set(campaigns.map(c => c.niche))), [campaigns]);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Explore Campaigns</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <select className="w-full p-2 rounded-md bg-zinc-800 text-white" value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="w-full p-2 rounded-md bg-zinc-800 text-white" value={niche} onChange={e => setNiche(e.target.value)}>
          <option value="">All Niches</option>
          {niches.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <input
          type="number"
          placeholder="Minimum Payout"
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          value={payout}
          onChange={e => setPayout(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map(c => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
          {filtered.length === 0 && <p className="text-center text-zinc-400 col-span-full">No campaigns found.</p>}
        </div>
      )}
    </main>
  );
}
