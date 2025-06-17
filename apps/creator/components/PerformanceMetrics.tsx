"use client";
import { useEffect, useState } from "react";
import { loadPerformance } from "@/lib/localPerformance";
import type { PerformanceData } from "@/types/performance";

export default function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData | null>(null);

  useEffect(() => {
    setData(loadPerformance());
  }, []);

  if (!data) {
    return (
      <div className="border border-white/10 bg-background p-4 rounded-xl shadow-sm space-y-2">
        <h2 className="text-lg font-bold">Performance Metrics</h2>
        <p className="text-sm text-foreground/60">No metrics saved.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-background p-4 rounded-xl shadow-sm space-y-2">
      <h2 className="text-lg font-bold">Performance Metrics</h2>
      <p className="text-sm">
        <span className="font-semibold">Follower Count:</span> {data.followerCount.toLocaleString()}
      </p>
      <p className="text-sm">
        <span className="font-semibold">Avg Views per Post:</span> {data.avgViews.toLocaleString()}
      </p>
      <p className="text-sm">
        <span className="font-semibold">Engagement Rate:</span> {data.engagementRate}%
      </p>
      <p className="text-sm">
        <span className="font-semibold">Growth Trend:</span> {data.growthTrend || "N/A"}
      </p>
    </div>
  );
}
