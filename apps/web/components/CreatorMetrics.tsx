"use client";
import { useEffect, useState } from "react";

type Props = {
  creatorId: string;
};

interface Metrics {
  totalFollowers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  monthlyGrowthRate: number;
  topContent: string[];
}

export default function CreatorMetrics({ creatorId }: Props) {
  const [data, setData] = useState<Metrics | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/creator-metrics/${creatorId}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error("metrics fetch", err);
      }
    }
    load();
  }, [creatorId]);

  if (!data) {
    return <p className="text-sm text-zinc-400">Loading metrics...</p>;
  }

  return (
    <div className="space-y-4 text-sm text-zinc-300">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-Siora-light rounded-lg border border-Siora-border">
          <div className="text-xs uppercase tracking-wide">Followers</div>
          <div className="text-base font-semibold">
            {data.totalFollowers.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-Siora-light rounded-lg border border-Siora-border">
          <div className="text-xs uppercase tracking-wide">Engagement Rate</div>
          <div className="text-base font-semibold">{data.engagementRate}%</div>
        </div>
        <div className="p-4 bg-Siora-light rounded-lg border border-Siora-border">
          <div className="text-xs uppercase tracking-wide">Monthly Growth</div>
          <div className="text-base font-semibold">
            {data.monthlyGrowthRate}%
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-Siora-light rounded-lg border border-Siora-border">
          <div className="text-xs uppercase tracking-wide">Avg Likes/Post</div>
          <div className="text-base font-semibold">
            {data.avgLikes.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-Siora-light rounded-lg border border-Siora-border">
          <div className="text-xs uppercase tracking-wide">Avg Comments/Post</div>
          <div className="text-base font-semibold">
            {data.avgComments.toLocaleString()}
          </div>
        </div>
      </div>
      {data.topContent && data.topContent.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">Top Content</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.topContent.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
