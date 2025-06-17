import React, { useEffect, useState } from "react";

interface PerfData {
  followers: number;
  engagementRate: number;
  avgViews: number;
  growth: number;
  posts?: { id: string; image: string; likes: number; comments: number }[];
  engagementBreakdown?: { likes: number; comments: number; shares: number };
}

export default function CreatorPerformance({ creatorId }: { creatorId: string }) {
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

  const metrics = [
    { label: "Followers", value: data.followers.toLocaleString(), icon: "\uD83D\uDC65" },
    { label: "Engagement", value: `${data.engagementRate}%`, icon: "\uD83D\uDCDD" },
    { label: "Avg Views", value: data.avgViews.toLocaleString(), icon: "\uD83D\uDC41" },
    { label: "Growth", value: `${Math.round(data.growth * 100)}%`, icon: data.growth >= 0 ? "\u2B06\uFE0F" : "\u2B07\uFE0F" },
  ];

  const breakdown = data.engagementBreakdown || { likes: 0, comments: 0, shares: 0 };
  const total = breakdown.likes + breakdown.comments + breakdown.shares;
  let cumulative = 0;
  const colors = ["#4ADE80", "#60A5FA", "#FBBF24"];
  const segments = Object.values(breakdown).map((val) => {
    const start = (cumulative / total) * 100;
    cumulative += val;
    const end = (cumulative / total) * 100;
    return `${start}% ${end}%`;
  });
  const gradient = `conic-gradient(${colors.map((c, i) => `${c} ${segments[i]}`).join(",")})`;

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-Siora-mid border border-Siora-border rounded-lg p-4 text-center">
            <div className="text-2xl" aria-hidden="true">{m.icon}</div>
            <div className="text-sm mt-1 text-zinc-400">{m.label}</div>
            <div className="font-semibold text-white">{m.value}</div>
          </div>
        ))}
      </div>

      {data.posts && data.posts.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Top Posts</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.posts.map((p) => (
              <div key={p.id} className="relative">
                <img src={p.image} alt="post" className="rounded-md object-cover w-full h-28" />
                <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">
                  ❤️ {p.likes}
                </span>
                <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-1 rounded">
                  💬 {p.comments}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {total > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Engagement Breakdown</h3>
          <div className="flex items-center gap-4">
            <div
              className="w-32 h-32 rounded-full border border-Siora-border"
              style={{ background: gradient }}
            ></div>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[0] }}></span> Likes</li>
              <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[1] }}></span> Comments</li>
              <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[2] }}></span> Shares</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
