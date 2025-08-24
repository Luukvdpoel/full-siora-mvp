"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Instagram, Star, Heart, Share2 } from "lucide-react";

export type Creator = {
  id: string;
  name: string;
  handle: string; // @username
  avatarUrl?: string;
  niche: string; // e.g. Fitness, Tech
  followers: number;
  tone: "Playful" | "Serious" | "Bold" | "Aspirational" | "Educational";
  values: string[]; // e.g. ["Sustainability","Inclusivity"]
  matchScore?: number; // 0–100
  avgViews?: number;
  er?: number; // engagement rate %
  location?: string;
};

function k(num?: number) {
  if (!num && num !== 0) return "—";
  if (num < 1000) return String(num);
  if (num < 1000000)
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
  return (num / 1000000).toFixed(1) + "M";
}

export function CreatorCard({
  data,
  className,
}: {
  data: Creator;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={cn(className)}
    >
      <Card className="group overflow-hidden border-white/10 bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
              <Image
                src={
                  data.avatarUrl ||
                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.handle}`
                }
                alt={data.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">{data.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <Instagram className="h-3.5 w-3.5" />
                      {data.handle}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{data.niche}</span>
                    {data.location && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span>{data.location}</span>
                      </>
                    )}
                  </div>
                </div>

                {typeof data.matchScore === "number" && (
                  <div
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs font-semibold",
                      data.matchScore >= 80
                        ? "bg-emerald-500/15 text-emerald-300"
                        : data.matchScore >= 60
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "bg-white/10 text-white/70"
                    )}
                    aria-label={`Match score ${data.matchScore}`}
                    title="Match score"
                  >
                    {Math.round(data.matchScore)}%
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="border-white/10 bg-white/5 text-white/80">
                  Tone: {data.tone}
                </Badge>
                {data.values.slice(0, 3).map((v) => (
                  <Badge key={v} className="border-white/10 bg-white/5 text-white/80">
                    {v}
                  </Badge>
                ))}
                {data.values.length > 3 && (
                  <Badge className="border-white/10 bg-white/5 text-white/60">
                    +{data.values.length - 3}
                  </Badge>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <Stat label="Followers" value={k(data.followers)} />
                <Stat label="Avg Views" value={k(data.avgViews)} />
                <Stat
                  label="ER"
                  value={
                    typeof data.er === "number" ? `${data.er.toFixed(1)}%` : "—"
                  }
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <CardAction
                  icon={<Heart className="h-4 w-4" />}
                  label="Shortlist"
                />
                <CardAction
                  icon={<Share2 className="h-4 w-4" />}
                  label="Share"
                />
                <CardAction icon={<Star className="h-4 w-4" />} label="Rate" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

function CardAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
      type="button"
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
