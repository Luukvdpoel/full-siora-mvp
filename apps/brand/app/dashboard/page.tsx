"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BrandCampaignCard from "../../../../web/components/BrandCampaignCard";

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
            <BrandCampaignCard key={b.id} brief={b} />
          ))}
        </div>
      )}
    </main>
  );
}
