'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { discoveryBrands } from '@creator/data/discoveryBrands';
import { getBrandBadges, getBrandTrustScore } from 'shared-utils';
import { Badge } from 'shared-ui';

export default function BrandProfile() {
  const params = useParams<{ id: string }>();
  const brand = discoveryBrands.find((b) => b.id === params.id);
  if (!brand) return <p className="p-6">Brand not found.</p>;

  const badges = getBrandBadges({
    verified: brand.verified,
    pastCampaigns: brand.pastCampaigns.length,
  });
  const trust = getBrandTrustScore({
    rating: brand.rating,
    responseHours: brand.responseHours,
    paymentDays: brand.paymentDays,
    completionRate: brand.completionRate,
  });
  const trustColor =
    trust.score >= 80 ? 'bg-green-600' : trust.score >= 50 ? 'bg-yellow-500' : 'bg-red-600';

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-4 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <Image src={brand.logo} alt={brand.name} width={60} height={60} unoptimized className="rounded-full" />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {brand.name}
            {badges.map((b) => (
              <Badge key={b.id} label={b.label} />
            ))}
          </h1>
          <p className="text-sm text-foreground/70">{brand.tagline}</p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded text-white ${trustColor}`}
            title={`Reviews: ${trust.breakdown.rating}/40\nResponse: ${trust.breakdown.response}/20\nPayment: ${trust.breakdown.payment}/20\nCompletion: ${trust.breakdown.completion}/20`}
          >
            Trust {trust.score}
          </span>
        </div>
      </div>
      <p className="text-sm">Industry: {brand.industry}</p>
      <div className="flex flex-wrap gap-2">
        {brand.vibes.map((v) => (
          <span key={v} className="px-2 py-0.5 text-xs bg-zinc-800 rounded">
            {v}
          </span>
        ))}
      </div>
      <h2 className="font-semibold">Past Campaigns</h2>
      <ul className="list-disc list-inside text-sm space-y-1">
        {brand.pastCampaigns.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <Link
        href={`/creator/feedback/${brand.id}`}
        className="inline-block mt-4 px-3 py-1 bg-gray-700 text-white rounded"
      >
        Leave/View Feedback
      </Link>
    </main>
  );
}
