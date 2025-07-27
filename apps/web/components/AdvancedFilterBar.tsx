'use client';
import React from 'react';

import { useState, useEffect } from "react";
import { creators } from "@/app/data/creators";
import TagInput from "./TagInput";

export type Filters = {
  platforms: string[];
  tones: string[];
  vibes: string[];
  niches: string[];
  formats: string[];
  values: string[];
  minEngagement: number;
  maxEngagement: number;
  minCollabs: number;
  minFollowers: number;
  maxFollowers: number;
};

interface Props {
  onFilter: (f: Filters) => void;
}

export default function AdvancedFilterBar({ onFilter }: Props) {
  const unique = <T extends string>(arr: (T | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as T[];

  const platforms = unique(creators.map((c) => c.platform));
  const tones = unique(creators.map((c) => c.tone));
  const vibes = unique(creators.map((c) => c.vibe));
  const niches = unique(creators.map((c) => c.niche));
  const formats = unique(creators.flatMap((c) => c.formats || []));

  const [platformsSel, setPlatformsSel] = useState<string[]>([]);
  const [tonesSel, setTonesSel] = useState<string[]>([]);
  const [vibesSel, setVibesSel] = useState<string[]>([]);
  const [nichesSel, setNichesSel] = useState<string[]>([]);
  const [formatsSel, setFormatsSel] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [minER, setMinER] = useState(0);
  const [maxER, setMaxER] = useState(10);
  const [minCollabs, setMinCollabs] = useState(0);
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxFollowers, setMaxFollowers] = useState(1000000);

  useEffect(() => {
    onFilter({
      platforms: platformsSel,
      tones: tonesSel,
      vibes: vibesSel,
      niches: nichesSel,
      formats: formatsSel,
      values,
      minEngagement: minER,
      maxEngagement: maxER,
      minCollabs,
      minFollowers,
      maxFollowers,
    });
  }, [platformsSel, tonesSel, vibesSel, nichesSel, formatsSel, values, minER, maxER, minCollabs, minFollowers, maxFollowers, onFilter]);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <div className="space-y-4 p-4 bg-Siora-light rounded-lg text-white">
      <div className="flex flex-wrap gap-4">
        {platforms.map((p) => (
          <label key={p} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={platformsSel.includes(p)}
              onChange={() => toggle(p, platformsSel, setPlatformsSel)}
            />
            {p}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {niches.map((n) => (
          <label key={n} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={nichesSel.includes(n)}
              onChange={() => toggle(n, nichesSel, setNichesSel)}
            />
            {n}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {tones.map((t) => (
          <label key={t} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={tonesSel.includes(t)}
              onChange={() => toggle(t, tonesSel, setTonesSel)}
            />
            {t}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {vibes.map((v) => (
          <label key={v} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={vibesSel.includes(v)}
              onChange={() => toggle(v || "", vibesSel, setVibesSel)}
            />
            {v}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {formats.map((f) => (
          <label key={f} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={formatsSel.includes(f)}
              onChange={() => toggle(f, formatsSel, setFormatsSel)}
            />
            {f}
          </label>
        ))}
      </div>

      <TagInput tags={values} onChange={setValues} placeholder="Add values" />

      <div className="flex items-center gap-2">
        <label>ER % {minER}+</label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={minER}
          onChange={(e) => setMinER(parseFloat(e.target.value))}
        />
        <label className="ml-4">Max {maxER}</label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={maxER}
          onChange={(e) => setMaxER(parseFloat(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-2">
        <label>Followers {minFollowers}+</label>
        <input
          type="number"
          min={0}
          value={minFollowers}
          onChange={(e) => setMinFollowers(parseInt(e.target.value) || 0)}
          className="w-24 p-1 rounded bg-Siora-dark text-white"
        />
        <label className="ml-4">Max {maxFollowers}</label>
        <input
          type="number"
          min={0}
          value={maxFollowers}
          onChange={(e) => setMaxFollowers(parseInt(e.target.value) || 0)}
          className="w-24 p-1 rounded bg-Siora-dark text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <label>Min Collabs {minCollabs}</label>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={minCollabs}
          onChange={(e) => setMinCollabs(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
