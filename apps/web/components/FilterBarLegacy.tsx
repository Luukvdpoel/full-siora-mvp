'use client';
import React from 'react';

import { useState, useEffect } from "react";

type Props = {
  onFilter: (filters: Record<string, string>) => void;
  onSort?: (sort: string) => void;
};

export default function FilterBar({ onFilter, onSort }: Props) {
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [minEngagement, setMinEngagement] = useState("");
  const [maxEngagement, setMaxEngagement] = useState("");
  const [sort, setSort] = useState("");

  // automatically push filter updates up to the parent
  useEffect(() => {
    onFilter({
      platform,
      tone,
      audience,
      minFollowers,
      maxFollowers,
      minEngagement,
      maxEngagement,
    });
  }, [platform, tone, audience, minFollowers, maxFollowers, minEngagement, maxEngagement, onFilter]);

  useEffect(() => {
    onSort?.(sort);
  }, [sort, onSort]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      >
        <option value="">All Platforms</option>
        <option value="Instagram">Instagram</option>
        <option value="TikTok">TikTok</option>
        <option value="YouTube">YouTube</option>
      </select>

      <input
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        placeholder="Tone"
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <input
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        placeholder="Audience"
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <input
        type="number"
        placeholder="Min Followers"
        value={minFollowers}
        onChange={(e) => setMinFollowers(e.target.value)}
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <input
        type="number"
        placeholder="Max Followers"
        value={maxFollowers}
        onChange={(e) => setMaxFollowers(e.target.value)}
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <input
        type="number"
        step="0.1"
        placeholder="Min ER%"
        value={minEngagement}
        onChange={(e) => setMinEngagement(e.target.value)}
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <input
        type="number"
        step="0.1"
        placeholder="Max ER%"
        value={maxEngagement}
        onChange={(e) => setMaxEngagement(e.target.value)}
        className="bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent transition"
        >
          <option value="">Sort by</option>
          <option value="followers-desc">Followers ↓</option>
          <option value="followers-asc">Followers ↑</option>
          <option value="engagement-desc">Engagement ↓</option>
          <option value="engagement-asc">Engagement ↑</option>
        </select>
      </div>
    </div>
  );
}






