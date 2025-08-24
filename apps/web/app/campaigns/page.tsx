import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      niche: true,
      targetTone: true,
      analyzedAt: true,
      createdAt: true,
    },
  });

  return (
    <section className="mx-auto max-w-4xl py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Link
          href="/campaigns/new"
          className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white"
        >
          New campaign
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold">{c.title}</div>
                <div className="text-xs text-white/60">
                  {c.niche || "—"} · {c.targetTone || "—"} · {""}
                  {c.analyzedAt ? "Analyzed" : "Not analyzed"}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/10"
                  href={`/campaigns/${c.id}/matches`}
                >
                  Matches
                </Link>
                <Link
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/10"
                  href={`/campaigns/${c.id}/edit`}
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No campaigns yet. Create one to get started.
          </div>
        )}
      </div>
    </section>
  );
}
