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

interface EngagementBreakdown {
  likes: number;
  comments: number;
  shares: number;
}

interface PerfData {
  avgReach: number;
  engagementRate: number;
  followerGrowth: number;
  topPosts: TopPost[];
  engagementBreakdown?: EngagementBreakdown;
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

  const cards = [
    {
      label: 'Avg Reach',
      value: data.avgReach.toLocaleString(),
      icon: '📊',
    },
    {
      label: 'Engagement',
      value: data.engagementRate + '%',
      icon: '💬',
    },
    {
      label: 'Growth',
      value: `${trendUp ? '+' : '-'}${trendPercent}%`,
      icon: trendUp ? '📈' : '📉',
    },
  ];

  const breakdown = data.engagementBreakdown;
  const total = breakdown
    ? breakdown.likes + breakdown.comments + breakdown.shares
    : 0;

  return (
    <div className="mt-6 space-y-4 text-sm text-zinc-300">
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-Siora-light border border-Siora-border rounded-lg p-3 flex flex-col items-center"
          >
            <span className="text-lg">{c.icon}</span>
            <span className="mt-1 text-xs text-zinc-400">{c.label}</span>
            <span className="font-semibold text-white">{c.value}</span>
          </div>
        ))}
      </div>

      {breakdown && (
        <div>
          <strong>Engagement Breakdown:</strong>
          <div className="flex h-3 mt-1 rounded overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${(breakdown.likes / total) * 100}%` }}
            />
            <div
              className="bg-blue-500"
              style={{ width: `${(breakdown.comments / total) * 100}%` }}
            />
            <div
              className="bg-purple-500"
              style={{ width: `${(breakdown.shares / total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Likes</span>
            <span>Comments</span>
            <span>Shares</span>
          </div>
        </div>
      )}

      {data.topPosts && (
        <div>
          <strong>Top Posts:</strong>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {data.topPosts.map((p) => (
              <li key={p.link}>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {p.title}
                </a>{' '}- {p.stats}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
