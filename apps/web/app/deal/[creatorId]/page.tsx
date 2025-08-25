import { prisma } from "@/lib/prisma";

export default async function DealPage({ params }: { params: { creatorId: string } }) {
  const c = await prisma.creator.findUnique({ where: { id: params.creatorId } });
  if (!c) return <div className="p-8">Creator not found</div>;

  return (
    <section className="mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-semibold">Deal evaluation — {c.name}</h1>
      <form className="mt-4 space-y-3" action="/api/deal/evaluate" method="POST">
        <input type="hidden" name="creatorId" value={c.id} />
        <textarea name="deliverables" required placeholder="1 IG reel + 3 stories…" className="w-full rounded border border-white/10 bg-white/5 p-2" rows={4}/>
        <input name="rights" placeholder="3 months paid usage + whitelisting" className="w-full rounded border border-white/10 bg-white/5 p-2"/>
        <input name="priceEUR" type="number" min={0} required placeholder="Budget (EUR)" className="w-full rounded border border-white/10 bg-white/5 p-2"/>
        <textarea name="notes" placeholder="Extra context…" className="w-full rounded border border-white/10 bg-white/5 p-2" rows={3}/>
        <button className="rounded-xl bg-white/90 px-4 py-2 text-gray-900">Evaluate (1 credit)</button>
      </form>
    </section>
  );
}
