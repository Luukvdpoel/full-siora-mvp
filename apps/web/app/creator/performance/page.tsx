"use client";

import { useState, useEffect } from "react";
import { useToast } from "@creator/components/Toast";
import { savePerformance, loadPerformance } from "@creator/lib/localPerformance";
import type { PerformanceData } from "@creator/types/performance";

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceData>({
    followerCount: 0,
    engagementRate: 0,
    avgViews: 0,
    growthTrend: "",
  });
  const toast = useToast();

  useEffect(() => {
    const stored = loadPerformance();
    if (stored) setMetrics(stored);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setMetrics((prev) => ({
      ...prev,
      [name]: name === "growthTrend" ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    savePerformance(metrics);
    toast("Saved performance metrics");
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Update Performance</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="followerCount">Follower Count</label>
          <input
            id="followerCount"
            name="followerCount"
            type="number"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={metrics.followerCount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="engagementRate">Engagement Rate (%)</label>
          <input
            id="engagementRate"
            name="engagementRate"
            type="number"
            step="0.1"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={metrics.engagementRate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="avgViews">Avg Views per Post</label>
          <input
            id="avgViews"
            name="avgViews"
            type="number"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={metrics.avgViews}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="growthTrend">Growth Trend</label>
          <input
            id="growthTrend"
            name="growthTrend"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={metrics.growthTrend}
            onChange={handleChange}
            placeholder="rising, steady, declining"
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md">
          Save Metrics
        </button>
      </form>
    </main>
  );
}
