export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function ShortlistBoard() {
  const sl = await prisma.shortlist.findFirst({
    include: { items: { include: { creator: true } } },
  });
  if (!sl) return <div className="p-8">No shortlist yet.</div>;

  const cols = ["PROSPECT","CONTACTED","NEGOTIATING","WON","LOST"] as const;
  return (
    <section className="mx-auto max-w-6xl py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{sl.name}</h1>
        <form action="/api/shortlist/share" method="POST">
          <input type="hidden" name="shortlistId" value={sl.id} />
          <button className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Share shortlist
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {cols.map(col => {
          const items = sl.items.filter(i => i.status === col);
          return (
            <div key={col} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-sm font-semibold">{col}</div>
              <div className="space-y-2">
                {items.map(i => (
                  <div key={i.id} className="rounded-xl border border-white/10 bg-gray-900 p-3">
                    <div className="text-sm font-medium">{i.creator.name}</div>
                    <div className="text-xs text-white/60">{i.creator.handle}</div>
                    <form className="mt-2 flex gap-2 text-xs" action="/api/shortlist/update" method="POST">
                      <input type="hidden" name="itemId" value={i.id} />
                      <select name="status" className="rounded border border-white/10 bg-white/5 px-2 py-1">
                        <option>PROSPECT</option><option>CONTACTED</option><option>NEGOTIATING</option><option>WON</option><option>LOST</option>
                      </select>
                      <input name="note" placeholder="Add note…" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1"/>
                      <button className="rounded border border-white/10 bg-white/10 px-2">Save</button>
                    </form>
                    <div className="mt-2 text-xs text-white/60">{i.note}</div>
                    <div className="mt-2 flex gap-2">
                      <a className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs" href={`/campaigns/${i.campaignId ?? ""}/matches`}>Matches</a>
                      <a className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs" href={`/deal/${i.creatorId}`}>Deal eval</a>
                    </div>
                  </div>
                ))}
                {!items.length && <div className="rounded border border-white/10 bg-white/5 p-2 text-xs text-white/60">Empty</div>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
