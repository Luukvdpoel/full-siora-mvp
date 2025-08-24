"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export type FilterState = {
  q: string;
  tone: string | "Any";
  niche: string | "Any";
  minFollowers: number;
  maxFollowers: number;
  verifiedOnly: boolean;
  sort: "match" | "followers" | "engagement";
};

const TONES = ["Playful", "Serious", "Bold", "Aspirational", "Educational"];
const NICHES = ["Fitness", "Tech", "Beauty", "Travel", "Food", "Lifestyle"];

export function FilterBar({
  value,
  onChange,
  className,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
}) {
  const [internal, setInternal] = React.useState<FilterState>(value);

  // Debounce text search
  const debouncedQ = useDebounce(internal.q, 250);
  React.useEffect(() => {
    onChange({ ...internal, q: debouncedQ });
  }, [debouncedQ, onChange, internal]);

  // Instantly propagate other fields
  React.useEffect(() => {
    onChange(internal);
  }, [internal, onChange]);

  function reset() {
    setInternal({
      q: "",
      tone: "Any",
      niche: "Any",
      minFollowers: 0,
      maxFollowers: 1_000_000,
      verifiedOnly: false,
      sort: "match",
    });
  }

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-gray-900/80 p-4 backdrop-blur", className)}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <Input
            placeholder="Search creators by name or handle…"
            value={internal.q}
            onChange={(e) => setInternal((s) => ({ ...s, q: e.target.value }))}
            className="bg-white/5 text-white placeholder:text-white/40"
          />
        </div>

        <div className="md:col-span-2">
          <Select
            value={internal.tone}
            onValueChange={(v) => setInternal((s) => ({ ...s, tone: v as any }))}
          >
            <SelectTrigger className="bg-white/5 text-white">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any tone</SelectItem>
              {TONES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Select
            value={internal.niche}
            onValueChange={(v) => setInternal((s) => ({ ...s, niche: v as any }))}
          >
            <SelectTrigger className="bg-white/5 text-white">
              <SelectValue placeholder="Niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any niche</SelectItem>
              {NICHES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs text-white/60">Min followers: {internal.minFollowers.toLocaleString()}</div>
          <Slider
            min={0}
            max={1000000}
            step={5000}
            value={[internal.minFollowers]}
            onValueChange={([v]) => setInternal((s) => ({ ...s, minFollowers: v }))}
          />
        </div>

        <div className="md:col-span-3 md:col-start-1">
          <div className="text-xs text-white/60">Max followers: {internal.maxFollowers.toLocaleString()}</div>
          <Slider
            min={10000}
            max={3000000}
            step={10000}
            value={[internal.maxFollowers]}
            onValueChange={([v]) => setInternal((s) => ({ ...s, maxFollowers: v }))}
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Checkbox
            id="verifiedOnly"
            checked={internal.verifiedOnly}
            onCheckedChange={(c) => setInternal((s) => ({ ...s, verifiedOnly: Boolean(c) }))}
          />
          <label htmlFor="verifiedOnly" className="text-sm text-white/80">Verified only</label>
        </div>

        <div className="flex items-center gap-2 md:col-span-3">
          <SortSelect
            value={internal.sort}
            onChange={(sort) => setInternal((s) => ({ ...s, sort }))}
          />
          <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <Separator className="my-3 bg-white/10" />
      <div className="text-xs text-white/50">
        Tip: type to search, then refine by tone, niche, and follower range.
      </div>
    </div>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: FilterState["sort"];
  onChange: (v: FilterState["sort"]) => void;
}) {
  const options: { value: FilterState["sort"]; label: string }[] = [
    { value: "match", label: "Best match" },
    { value: "followers", label: "Followers" },
    { value: "engagement", label: "Engagement" },
  ];

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-white/70">Sort</span>
      <Select value={value} onValueChange={(v) => onChange(v as any)}>
        <SelectTrigger className="w-[160px] bg-white/5 text-white">
          <SelectValue />
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
