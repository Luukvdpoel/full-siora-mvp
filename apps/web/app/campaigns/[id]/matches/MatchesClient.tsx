"use client";
import Link from "next/link";
import * as React from "react";

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

            <div className="mt-4 flex items-center justify-end">
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
