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
  engagementBreakdown: {
    likes: number;
    comments: number;
    shares: number;
  };
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
    <div className="mt-8 space-y-6 text-sm text-zinc-300">
      <h2 className="text-lg font-semibold">Performance</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-Siora-mid border border-Siora-border rounded-lg p-3 text-center space-y-1">
          <div className="text-xl">📊</div>
          <div>Avg Reach</div>
          <div className="font-semibold">{data.avgReach.toLocaleString()}</div>
        </div>
        <div className="bg-Siora-mid border border-Siora-border rounded-lg p-3 text-center space-y-1">
          <div className="text-xl">💬</div>
          <div>Engagement</div>
          <div className="font-semibold">{data.engagementRate}%</div>
        </div>
        <div className="bg-Siora-mid border border-Siora-border rounded-lg p-3 text-center space-y-1">
          <div className="text-xl">{trendUp ? '📈' : '📉'}</div>
          <div>Growth</div>
          <div className="font-semibold">{trendPercent}%</div>
        </div>
      </div>

      {data.topPosts && (
        <div>
          <strong>Top Posts:</strong>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {data.topPosts.map((p) => (
              <li key={p.link}>
                <a href={p.link} target="_blank" rel="noreferrer" className="underline">
                  {p.title}
                </a>{' '}- {p.stats}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <strong>Engagement Breakdown:</strong>
        <div className="mt-2 space-y-2">
          {Object.entries(data.engagementBreakdown).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="w-20 capitalize">{k}</span>
              <div className="flex-1 bg-zinc-700 rounded h-2">
                <div
                  className="bg-Siora-accent h-2 rounded"
                  style={{ width: `${v}%` }}
                />
              </div>
              <span className="w-10 text-right">{v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
