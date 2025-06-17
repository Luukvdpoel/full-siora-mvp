"use client";
import { useEffect, useState } from "react";

type Props = {
  creatorId: string;
};

interface PerfData {
  followers: number;
  engagementRate: number;
  avgViews: number;
  growth: number;
}

export default function PerformanceTab({ creatorId }: Props) {
  const [data, setData] = useState<PerfData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/performance/${creatorId}`);
        if (res.ok) {
          const d = await res.json();
          setData(d);
        }
      } catch (err) {
        console.error("performance fetch", err);
      }
    }
    load();
  }, [creatorId]);

  if (!data) {
    return <p className="text-sm text-zinc-400">Loading performance...</p>;
  }

  const trendUp = data.growth >= 0;
  const trendPercent = Math.round(Math.abs(data.growth * 100));

  return (
    <div className="mt-6 space-y-2 text-sm text-zinc-300">
      <div>
        <strong>Followers:</strong> {data.followers.toLocaleString()}
      </div>
      <div>
        <strong>Engagement Rate:</strong> {data.engagementRate}%
      </div>
      <div>
        <strong>Avg Views:</strong> {data.avgViews.toLocaleString()}
      </div>
      <div className="flex items-center gap-1">
        <strong>Growth:</strong>
        <span className={trendUp ? "text-green-400" : "text-red-400"}>
          {trendUp ? "▲" : "▼"}
        </span>
        <span>{trendPercent}%</span>
      </div>
    </div>
  );
}
