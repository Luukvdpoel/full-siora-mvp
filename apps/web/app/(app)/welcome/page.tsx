"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import posthog from "posthog-js";

export default function WelcomePage() {
  const r = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const niche = (form.elements.namedItem("niche") as HTMLInputElement).value;
    const goal = (form.elements.namedItem("goal") as HTMLSelectElement).value;

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ niche, goal }),
    });
    const j = await res.json();
    posthog.capture("onboarding_completed", { niche, goal });
    r.push(`/campaigns/${j.campaignId}/matches?auto=1`);
  }

  return (
    <main className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold">Welcome to Siora 🎉</h1>
      <p className="mt-2 text-white/60">Tell us a bit about your brand.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          name="niche"
          placeholder="Your niche (e.g. skincare, fitness)"
          required
          className="w-full rounded border border-white/10 bg-white/5 p-3"
        />
        <select
          name="goal"
          className="w-full rounded border border-white/10 bg-white/5 p-3"
          required
        >
          <option value="awareness">Grow awareness</option>
          <option value="sales">Drive sales</option>
          <option value="content">Get authentic content</option>
        </select>
        <button
          disabled={loading}
          className="w-full rounded-xl bg-white/90 py-3 text-gray-900"
        >
          {loading ? "Setting up…" : "Continue"}
        </button>
      </form>
    </main>
  );
}

