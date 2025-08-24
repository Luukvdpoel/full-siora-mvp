"use client";
import * as React from "react";

export function BuyCredits() {
  const [loading, setLoading] = React.useState<string | null>(null);

  async function buy(pack: "100" | "500" | "2000") {
    setLoading(pack);
    const r = await fetch("/api/credits/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pack }),
    });
    const { url } = await r.json();
    window.location.href = url;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {(["100", "500", "2000"] as const).map((p) => (
        <button
          key={p}
          onClick={() => buy(p)}
          disabled={loading === p}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
        >
          {loading === p ? "Redirecting…" : `Buy ${p} credits`}
        </button>
      ))}
    </div>
  );
}
