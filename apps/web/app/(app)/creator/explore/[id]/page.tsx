'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Campaign } from '@/app/creator/data/campaigns';

export default function CampaignDetail() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    async function load() {
      if (!params.id) return;
      const res = await fetch(`/api/campaigns/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      }
    }
    load();
  }, [params.id]);

  if (!campaign) return <p className="p-6">Loading...</p>;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{campaign.title}</h1>
      <p className="text-sm text-foreground/80">Brand: {campaign.brand}</p>
      <p className="text-sm">Platform: {campaign.platform}</p>
      <p className="text-sm">Niche: {campaign.niche}</p>
      <p className="text-sm">Budget: ${campaign.budgetMin} - ${campaign.budgetMax}</p>
      <p className="text-sm">Deliverables: {campaign.deliverables}</p>
      <p className="text-sm">Deadline: {campaign.deadline}</p>
      <Link
        href={`/campaigns/${campaign.id}/apply`}
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Apply Now
      </Link>
    </main>
  );
}
