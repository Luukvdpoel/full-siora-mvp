"use client";
import { useEffect, useState } from "react";

type Props = {
  creatorId: string;
};

interface TopPost {
  type: string;
  title: string;
  link: string;
  stats: string;
}

interface PerfData {
  avgReach: number;
  engagementRate: number;
  followerGrowth: number;
  topPosts: TopPost[];
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

  const trendUp = data.followerGrowth >= 0;
  const trendPercent = Math.round(Math.abs(data.followerGrowth));

  return (
    <div className="mt-6 space-y-2 text-sm text-zinc-300">
      <div>
        <strong>Avg Reach:</strong> {data.avgReach.toLocaleString()}
      </div>
      <div>
        <strong>Engagement Rate:</strong> {data.engagementRate}%
      </div>
      <div className="flex items-center gap-1">
        <strong>Follower Growth:</strong>
        <span className={trendUp ? "text-green-400" : "text-red-400"}>
          {trendUp ? "▲" : "▼"}
        </span>
        <span>{trendPercent}%</span>
      </div>
      {data.topPosts && (
        <div>
          <strong>Top Posts:</strong>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {data.topPosts.map((p) => (
              <li key={p.link}>
                <a href={p.link} target="_blank" rel="noreferrer" className="underline">
                  {p.title}
                </a>{" "}- {p.stats}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
