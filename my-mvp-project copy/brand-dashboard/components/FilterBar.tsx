"use client";

import { useState } from "react";

type Props = {
  onFilter: (filters: Record<string, string>) => void;
  onSort: (sort: string) => void;
};

export default function FilterBar({ onFilter, onSort }: Props) {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [sort, setSort] = useState("");

  const handleApply = () => {
    onFilter({ niche, platform, minFollowers, maxFollowers });
    onSort(sort);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <select
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        className="bg-nura-light text-white p-2 rounded-lg border border-nura-border focus:outline-none focus:ring-2 focus:ring-nura-accent transition"
      >
        <option value="">All Niches</option>
        <option value="Beauty">Beauty</option>
        <option value="Fitness">Fitness</option>
        <option value="Tech">Tech</option>
        <option value="Finance">Finance</option>
        <option value="Travel">Travel</option>
        <option value="Home & Plants">Home & Plants</option>
        <option value="Gaming">Gaming</option>
        <option value="Food">Food</option>
      </select>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="bg-nura-light text-white p-2 rounded-lg border border-nura-border focus:outline-none focus:ring-2 focus:ring-nura-accent transition"
      >
        <option value="">All Platforms</option>
        <option value="Instagram">Instagram</option>
        <option value="TikTok">TikTok</option>
        <option value="YouTube">YouTube</option>
      </select>

      <input
        type="number"
        placeholder="Min Followers"
        value={minFollowers}
        onChange={(e) => setMinFollowers(e.target.value)}
        className="bg-nura-light text-white p-2 rounded-lg border border-nura-border focus:outline-none focus:ring-2 focus:ring-nura-accent transition"
      />

      <input
        type="number"
        placeholder="Max Followers"
        value={maxFollowers}
        onChange={(e) => setMaxFollowers(e.target.value)}
        className="bg-nura-light text-white p-2 rounded-lg border border-nura-border focus:outline-none focus:ring-2 focus:ring-nura-accent transition"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="flex-1 bg-nura-light text-white p-2 rounded-lg border border-nura-border focus:outline-none focus:ring-2 focus:ring-nura-accent transition"
        >
          <option value="">Sort by</option>
          <option value="followers-desc">Followers ↓</option>
          <option value="followers-asc">Followers ↑</option>
          <option value="engagement-desc">Engagement ↓</option>
          <option value="engagement-asc">Engagement ↑</option>
        </select>

        <button
          onClick={handleApply}
          className="bg-nura-accent hover:bg-nura-accent-soft text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}






