"use client";
import Link from "next/link";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CreatorRow = {
  id: string;
  name: string;
  handle: string;
  niche: string | null;
  tone: string | null;
  values: string[] | null;
  followers: number;
  avgViews: number;
  engagement: number | null;
  location: string | null;
  score: number;
  rationale: string;
  breakdown?: {
    toneMatch01: number;
    nicheMatch01: number;
    valuesOverlap01: number;
    engagement01: number;
    semanticHint?: string;
  };
};

export default function MatchesClient({
  campaign,
  initialMatches,
}: {
  campaign: {
    id: string;
    title: string;
    brief: string;
    niche: string;
    targetTone: string;
    analyzedAt: string | null;
    credits: number;
    plan: "FREE" | "PRO";
  };
  initialMatches: CreatorRow[];
}) {
  const [matches, setMatches] = React.useState<CreatorRow[]>(initialMatches);
  const [loading, setLoading] = React.useState<null | string>(null);
  const [error, setError] = React.useState<string>("");
  const [autoMsg, setAutoMsg] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id].slice(-3)
    );
  }

  const estimatedCost = (!campaign.analyzedAt ? 1 : 0) + 20;

  async function analyzeCampaign() {
    setLoading("analyze");
    setError("");
    const r = await fetch("/api/campaigns/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id }),
    });
    const j = await r.json().catch(() => ({}));
    setLoading(null);
    if (!r.ok) return setError(j?.error || "Failed to analyze campaign");
    alert(`Analyzed: tone ${j.tone}`);
    // no hard reload needed; user can now generate matches
  }

  async function generateMatches() {
    setLoading("generate");
    setError("");
    const r = await fetch("/api/match/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, topK: 20 }),
    });
    const j = await r.json().catch(() => ({}));
    setLoading(null);
    if (!r.ok) {
      if (r.status === 402) {
        return setError(j?.error || "Not enough credits. Buy credits in Billing.");
      }
      return setError(j?.error || "Failed to generate matches");
    }
    setMatches(j.data);
  }

  async function autoAnalyzeAndGenerate() {
    setLoading("auto");
    setError("");
    setAutoMsg("");
    const r = await fetch("/api/match/auto", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, topK: 20 }),
    });
    const j = await r.json().catch(() => ({}));
    setLoading(null);

    if (!r.ok) {
      if (r.status === 402) return setError(j?.error || "Not enough credits.");
      return setError(j?.error || "Failed to run auto match");
    }

    if (j.analyzed) setAutoMsg("Analyzed campaign (+1 credit) and generated matches.");
    setMatches(j.data);
  }

  function exportCSV() {
    const rows = [
      [
        "Score",
        "Name",
        "Handle",
        "Niche",
        "Tone",
        "Values",
        "Followers",
        "AvgViews",
        "Engagement",
        "Location",
        "Rationale",
      ],
      ...matches.map((m) => [
        m.score,
        m.name,
        m.handle,
        m.niche ?? "",
        m.tone ?? "",
        (m.values ?? []).join("; "),
        m.followers,
        m.avgViews,
        m.engagement ?? "",
        m.location ?? "",
        m.rationale.replaceAll("\n", " ").replaceAll(",", ";"),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siora_matches_${campaign.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shortlist(creatorId: string) {
    setLoading(`shortlist:${creatorId}`);
    const r = await fetch("/api/shortlist/add", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creatorId }),
    });
    setLoading(null);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return alert(j?.error || "Failed to add to shortlist");
    }
    alert("Added to shortlist.");
  }

  return (
    <section className="py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{campaign.title}</h1>
          <p className="mt-1 text-white/60">
            Tone: <b>{campaign.targetTone || "—"}</b> · Niche: <b>{campaign.niche || "—"}</b>
          </p>
          {!campaign.analyzedAt && (
            <p className="mt-2 text-amber-300/90">Campaign not analyzed yet — do that first.</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
            Credits: <b className="ml-1">{campaign.credits.toLocaleString()}</b>
          </div>
          <Link
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
            href={`/campaigns/${campaign.id}/edit`}
          >
            Edit campaign
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!campaign.analyzedAt ? (
          <button
            onClick={analyzeCampaign}
            disabled={loading === "analyze"}
            className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white disabled:opacity-60"
          >
            {loading === "analyze" ? "Analyzing…" : "Analyze Campaign (1 credit)"}
          </button>
        ) : (
          <button
            onClick={generateMatches}
            disabled={loading === "generate"}
            className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white disabled:opacity-60"
          >
            {loading === "generate" ? "Generating…" : "Generate Matches (≈1 credit per result)"}
          </button>
        )}

        <button
          onClick={autoAnalyzeAndGenerate}
          disabled={loading === "auto"}
          className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white disabled:opacity-60"
        >
          {loading === "auto" ? "Working…" : "Analyze + Generate (auto)"}
        </button>

        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
          ~{estimatedCost} credits
        </span>

        <button
          onClick={exportCSV}
          disabled={!matches.length}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
        >
          Export CSV
        </button>

        <a
          href="/billing"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Billing & Credits
        </a>
      </div>

      {selected.length >= 2 && (
        <CompareDialog
          creators={matches.filter((m) => selected.includes(m.id))}
          onClose={() => setSelected([])}
        />
      )}

      {autoMsg && (
        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-200">
          {autoMsg}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-gray-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">{m.name}</div>
                <div className="text-xs text-white/60">{m.handle}</div>
              </div>
              <div
                className={
                  "rounded-lg px-2 py-1 text-xs font-semibold " +
                  (m.score >= 80
                    ? "bg-emerald-500/15 text-emerald-300"
                    : m.score >= 60
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "bg-white/10 text-white/70")
                }
              >
                {m.score}%
              </div>
            </div>

            <div className="mt-2 text-sm text-white/70">{m.rationale}</div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <Stat label="Followers" value={fmtK(m.followers)} />
              <Stat label="Avg Views" value={fmtK(m.avgViews)} />
              <Stat label="ER" value={m.engagement ? `${m.engagement.toFixed(1)}%` : "—"} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1 text-xs text-white/70">
              {m.tone && <Chip>{m.tone}</Chip>}
              {m.niche && <Chip>{m.niche}</Chip>}
              {(m.values || []).slice(0, 3).map((v) => (
                <Chip key={v}>{v}</Chip>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DetailsDialog m={m} campaign={{ niche: campaign.niche, targetTone: campaign.targetTone }} />
                <label className="flex items-center gap-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={selected.includes(m.id)}
                    onChange={() => toggleSelect(m.id)}
                    className="h-3 w-3 accent-indigo-500"
                  />
                  Compare
                </label>
              </div>
              <button
                onClick={() => shortlist(m.id)}
                disabled={loading === `shortlist:${m.id}`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-60"
              >
                {loading === `shortlist:${m.id}` ? "Adding…" : "Add to shortlist"}
              </button>
            </div>
          </div>
        ))}

        {!matches.length && (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No matches yet. Analyze the campaign, then generate matches.
          </div>
        )}
      </div>
    </section>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, v)) * 100);
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded bg-white/10">
        <div className="h-1.5 rounded bg-white/80" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DetailsDialog({ m, campaign }: { m: CreatorRow; campaign: { niche: string; targetTone: string } }) {
  const toneMatch =
    m.breakdown?.toneMatch01 ?? (m.tone && campaign.targetTone ? (m.tone === campaign.targetTone ? 1 : 0) : 0);
  const nicheMatch =
    m.breakdown?.nicheMatch01 ?? (m.niche && campaign.niche ? (m.niche === campaign.niche ? 1 : 0) : 0);
  const valuesOverlap = m.breakdown?.valuesOverlap01 ?? 0;
  const engagement01 =
    m.breakdown?.engagement01 ?? (m.engagement ? Math.min(1, Math.max(0, m.engagement / 10)) : 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">Details</button>
      </DialogTrigger>
      <DialogContent className="max-w-lg border-white/10 bg-gray-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-base">
            {m.name} <span className="text-white/50">({m.handle})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">Overall match</div>
              <div
                className={
                  "rounded-md px-2 py-0.5 text-xs font-semibold " +
                  (m.score >= 80
                    ? "bg-emerald-500/15 text-emerald-300"
                    : m.score >= 60
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "bg-white/10 text-white/70")
                }
              >
                {m.score}%
              </div>
            </div>
            <p className="mt-2 text-white/70">{m.rationale}</p>
          </div>

          <div>
            <div className="text-sm font-medium">Fit breakdown</div>
            <div className="mt-2">
              <Bar label={`Tone (${m.tone ?? "—"} vs ${campaign.targetTone || "—"})`} v={toneMatch} />
              <Bar label={`Niche (${m.niche ?? "—"} vs ${campaign.niche || "—"})`} v={nicheMatch} />
              <Bar label={`Values overlap`} v={valuesOverlap} />
              <Bar label={`Engagement quality`} v={engagement01} />
            </div>
            <p className="mt-1 text-xs text-white/50">
              {m.breakdown?.semanticHint ?? "Includes semantic similarity from your campaign brief."}
            </p>
          </div>

          <div className="text-sm">
            <div className="font-medium">Creator attributes</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {m.tone && <Chip>{m.tone}</Chip>}
              {m.niche && <Chip>{m.niche}</Chip>}
              {(m.values || []).map((v) => (
                <Chip key={v}>{v}</Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <Stat label="Followers" value={fmtK(m.followers)} />
            <Stat label="Avg Views" value={fmtK(m.avgViews)} />
            <Stat label="ER" value={m.engagement ? `${m.engagement.toFixed(1)}%` : "—"} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">{children}</span>;
}
function fmtK(n: number) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return (n / 1000).toFixed(n % 1000 ? 1 : 0) + "k";
  return (n / 1_000_000).toFixed(1) + "M";
}

function CompareDialog({
  creators,
  onClose,
}: {
  creators: CreatorRow[];
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl border-white/10 bg-gray-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg">Compare creators</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="text-white/60">
                <th className="p-2 text-left">Metric</th>
                {creators.map((c) => (
                  <th key={c.id} className="p-2 text-left font-medium">
                    {c.name} <span className="text-xs text-white/50">({c.handle})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Match Score</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2 font-semibold">
                    {c.score}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Followers</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">{fmtK(c.followers)}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Avg Views</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">{fmtK(c.avgViews)}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Engagement</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">
                    {c.engagement ? `${c.engagement.toFixed(1)}%` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Tone</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">{c.tone || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Niche</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">{c.niche || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Values</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2">{(c.values || []).join(", ")}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2">Rationale</td>
                {creators.map((c) => (
                  <td key={c.id} className="p-2 text-white/70">{c.rationale}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
