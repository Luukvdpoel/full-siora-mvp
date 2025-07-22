import React from 'react';
"use client";
import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Checkbox from "@/components/ui/checkbox";

type Props = {
  tones: string[];
  personaTypes: string[];
  onChange: (f: { tone: string; personaTypes: string[] }) => void;
};

export default function CreatorFilters({ tones, personaTypes, onChange }: Props) {
  const [tone, setTone] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    onChange({ tone, personaTypes: types });
  }, [tone, types, onChange]);

  const toggleType = (t: string, checked: boolean) => {
    setTypes((prev) =>
      checked ? [...prev, t] : prev.filter((v) => v !== t)
    );
  };

  return (
    <div className="space-y-4">
      <Dropdown
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full"
      >
        <option value="">All Tones</option>
        {tones.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Dropdown>
      <div className="flex flex-wrap gap-2">
        {personaTypes.map((p) => (
          <label key={p} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={types.includes(p)}
              onChange={(e) => toggleType(p, e.target.checked)}
            />
            {p}
          </label>
        ))}
      </div>
    </div>
  );
}
