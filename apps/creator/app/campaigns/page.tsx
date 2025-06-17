"use client";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

interface Campaign {
  id: string;
  name: string;
  description: string;
  deliverables: string;
  deadline: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setCampaigns(data as Campaign[]);
        }
      } catch (err) {
        console.error("Failed to load campaigns", err);
      }
    }
    load();
  }, []);

  async function apply(id: string) {
    try {
      await fetch("/api/campaign-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: id,
          pitch: "Excited to collaborate!",
          personaSummary: "",
        }),
      });
      setToast("Application submitted!");
    } catch {
      setToast("Failed to apply");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">Brand Campaigns</h1>
      <div className="space-y-4">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="border border-white/10 p-4 rounded-lg space-y-2"
          >
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm">{c.description}</p>
            <p className="text-sm text-foreground/80">
              Deliverables: {c.deliverables}
            </p>
            <p className="text-sm text-foreground/80">
              Deadline: {new Date(c.deadline).toLocaleDateString()}
            </p>
            <button
              onClick={() => apply(c.id)}
              className="text-indigo-600 underline"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </main>
  );
}
