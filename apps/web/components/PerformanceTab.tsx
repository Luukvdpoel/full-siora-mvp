import React from 'react';
"use client";
import { useEffect, useState } from "react";
import { Spinner } from "shared-ui";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChartLine, FaHeart, FaUsers } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  engagementBreakdown: {
    likes: number;
    comments: number;
    shares: number;
  };
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
    return <Spinner />;
  }

  const trendUp = data.followerGrowth >= 0;
  const trendPercent = Math.round(Math.abs(data.followerGrowth));

  const reachPct = Math.min(100, Math.round((data.avgReach / 20000) * 100));
  const engagePct = Math.min(100, Math.round((data.engagementRate / 10) * 100));
  const growthPct = Math.min(100, Math.round((Math.abs(data.followerGrowth) / 10) * 100));

  const chartData = {
    labels: ["Likes", "Comments", "Shares"],
    datasets: [
      {
        data: [
          data.engagementBreakdown.likes,
          data.engagementBreakdown.comments,
          data.engagementBreakdown.shares,
        ],
        backgroundColor: ["#f472b6", "#60a5fa", "#facc15"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="mt-6 space-y-6 text-sm text-zinc-300">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="flex flex-col gap-2 p-4 bg-Siora-light rounded-lg border border-Siora-border"
          title="Average number of people each post reaches"
        >
          <div className="flex items-center gap-2">
            <FaUsers className="text-Siora-accent" />
            <div>
              <div className="text-xs uppercase tracking-wide">Avg Reach</div>
              <div className="text-base font-semibold">{data.avgReach.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full h-2 bg-zinc-700/50 rounded">
            <div className="h-2 bg-Siora-accent rounded" style={{ width: `${reachPct}%` }} />
          </div>
        </div>
        <div
          className="flex flex-col gap-2 p-4 bg-Siora-light rounded-lg border border-Siora-border"
          title="Percentage of followers who interact with posts"
        >
          <div className="flex items-center gap-2">
            <FaHeart className="text-Siora-accent" />
            <div>
              <div className="text-xs uppercase tracking-wide">Engagement Rate</div>
              <div className="text-base font-semibold">{data.engagementRate}%</div>
            </div>
          </div>
          <div className="w-full h-2 bg-zinc-700/50 rounded">
            <div className="h-2 bg-green-400 rounded" style={{ width: `${engagePct}%` }} />
          </div>
        </div>
        <div
          className="flex flex-col gap-2 p-4 bg-Siora-light rounded-lg border border-Siora-border"
          title="Change in followers over the last month"
        >
          <div className="flex items-center gap-2">
            <FaChartLine className="text-Siora-accent" />
            <div>
              <div className="text-xs uppercase tracking-wide">Follower Growth</div>
              <div className={`text-base font-semibold ${trendUp ? "text-green-400" : "text-red-400"}`}>{trendUp ? "▲" : "▼"} {trendPercent}%</div>
            </div>
          </div>
          <div className="w-full h-2 bg-zinc-700/50 rounded">
            <div className={`h-2 rounded ${trendUp ? "bg-green-400" : "bg-red-400"}`} style={{ width: `${growthPct}%` }} />
          </div>
        </div>
      </div>
      {data.topPosts && (
        <div>
          <h3 className="text-md font-semibold mb-2">Top Posts</h3>
          <ul className="space-y-2">
            {data.topPosts.map((p) => (
              <li key={p.link} className="p-3 bg-Siora-light rounded border border-Siora-border">
                <a href={p.link} target="_blank" rel="noreferrer" className="underline">
                  {p.title}
                </a>
                <span className="ml-2 text-zinc-400">- {p.stats}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="text-md font-semibold mb-2">Engagement Breakdown</h3>
        <div className="max-w-xs">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
}
