import { prisma } from "@/lib/prisma";
export default async function PrintShortlist() {
  const sl = await prisma.shortlist.findFirst({
    include: { items: { include: { creator: true } } },
  });
  if (!sl) return null;
  return (
    <section className="mx-auto max-w-4xl p-6 print:p-0">
      <h1 className="text-2xl font-semibold">Shortlist Summary</h1>
      <div className="mt-4 grid gap-2">
        {sl.items.map(i => (
          <div key={i.id} className="rounded border border-black/10 bg-white p-3 text-black print:border-0">
            <div className="font-semibold">{i.creator.name} <span className="text-black/60">{i.creator.handle}</span></div>
            <div className="text-sm">Followers: {i.creator.followers.toLocaleString()} · ER: {i.creator.engagement ?? "—"}%</div>
            <div className="text-sm">Tone: {i.creator.tone ?? "—"} · Niche: {i.creator.niche ?? "—"}</div>
            <div className="text-sm">Values: {(i.creator.values || []).join(", ")}</div>
            {i.note && <div className="mt-1 text-sm">Note: {i.note}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
