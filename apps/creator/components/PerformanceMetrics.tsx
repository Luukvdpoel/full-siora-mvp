import React from "react";

const mockData = {
  followers: {
    instagram: 12000,
    tiktok: 15000,
    youtube: 8000,
  },
  avgViews: 5000,
  engagementRate: 4.8,
  recentTopContent: [
    { title: "How to style activewear", views: 12000 },
    { title: "Daily workout routine", views: 11000 },
    { title: "Healthy meal prep ideas", views: 10500 },
  ],
};

export default function PerformanceMetrics() {
  const { followers, avgViews, engagementRate, recentTopContent } = mockData;
  return (
    <div className="border border-white/10 bg-background p-4 rounded-xl shadow-sm space-y-4">
      <h2 className="text-lg font-bold">Performance Metrics</h2>
      <div>
        <h3 className="font-semibold text-sm mb-1">Total Followers</h3>
        <ul className="text-sm space-y-1">
          {Object.entries(followers).map(([platform, count]) => (
            <li key={platform} className="flex justify-between">
              <span className="capitalize">{platform}</span>
              <span>{count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-semibold">Avg Views per Post:</span>{" "}
          {avgViews.toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Engagement Rate:</span>{" "}
          {engagementRate}%
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">Recent Top Content</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          {recentTopContent.map((post, i) => (
            <li key={i}>
              {post.title} - {post.views.toLocaleString()} views
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
