"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { loadPerformance } from "@creator/lib/localPerformance";
import type { PerformanceData } from "@creator/types/performance";
import { FaUsers, FaEye, FaHeart, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData | null>(null);

  useEffect(() => {
    setData(loadPerformance());
  }, []);

  const metrics = data
    ? [
        {
          label: "Followers",
          value: data.followerCount.toLocaleString(),
          icon: FaUsers,
          tooltip: "Total follower count",
        },
        {
          label: "Avg Views",
          value: data.avgViews.toLocaleString(),
          icon: FaEye,
          tooltip: "Average views per post",
        },
        {
          label: "Engagement Rate",
          value: `${data.engagementRate}%`,
          icon: FaHeart,
          tooltip: "(likes + comments) / followers",
        },
        {
          label: "Growth Trend",
          value: data.growthTrend || "N/A",
          icon: FaChartLine,
          tooltip: "Follower growth trend",
        },
      ]
    : [];

  return (
    <div className="border border-white/10 bg-background p-4 rounded-xl shadow-sm space-y-4">
      <h2 className="text-lg font-bold">Performance Metrics</h2>
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map(({ label, value, icon: Icon, tooltip }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-white/10"
            >
              <Icon className="text-indigo-600 text-xl" />
              <div className="space-y-0.5">
                <div className="text-sm font-medium flex items-center gap-1">
                  {label}
                  <span className="cursor-default" title={tooltip}>
                    \u2139\uFE0F
                  </span>
                </div>
                <div className="text-base font-semibold">{value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/60">No metrics saved.</p>
      )}
    </div>
  );
}
