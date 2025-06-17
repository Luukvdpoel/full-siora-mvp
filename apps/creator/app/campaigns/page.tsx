"use client";
import Link from "next/link";
import campaigns from "@/app/data/campaigns";

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">Brand Campaigns</h1>
      <div className="space-y-4">
        {campaigns.map((c) => (
          <div key={c.id} className="border border-white/10 p-4 rounded-lg space-y-2">
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-foreground/80">{c.brand}</p>
            <p className="text-sm">{c.description}</p>
            <Link href={`/campaigns/${c.id}/apply`} className="text-indigo-600 underline">
              Apply
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
