"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatorCard from "@/components/CreatorCard";
import type { Creator } from "@/app/data/creators";

export default function BrandOnboarding() {
  const router = useRouter();
  const [form, setForm] = useState({
    goals: "",
    platforms: "",
    tone: "",
    audience: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Creator[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prefs = {
      tone: form.tone || undefined,
      desiredFormats: form.platforms
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      values: form.goals
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      niches: form.audience
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("brandPrefs", JSON.stringify(prefs));
    }
    setLoading(true);
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: `${form.goals} ${form.audience}`.trim(),
          tone: form.tone,
        }),
      });
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-Siora-mid p-6 rounded-2xl space-y-4">
          <h1 className="text-2xl font-bold">Brand Onboarding</h1>
          <textarea
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Campaign goals"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            name="platforms"
            value={form.platforms}
            onChange={handleChange}
            placeholder="Preferred platforms (comma separated)"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            name="tone"
            value={form.tone}
            onChange={handleChange}
            placeholder="Brand tone"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            name="audience"
            value={form.audience}
            onChange={handleChange}
            placeholder="Target audience"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <button
            type="submit"
            className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold w-full"
          >
            {loading ? "Finding Matches..." : "Save & Find Matches"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10 space-y-6">
          <h2 className="text-2xl font-semibold">Suggested Creators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
