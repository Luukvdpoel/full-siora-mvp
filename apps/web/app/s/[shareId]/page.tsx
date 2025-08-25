import { prisma } from "@/lib/prisma";
export default async function SharedShortlist({ params }: { params: { shareId: string } }) {
  const sl = await prisma.shortlist.findFirst({
    where: { shareId: params.shareId },
    include: { items: { include: { creator: true } } },
  });
  if (!sl) return <div className="p-8">Share not found.</div>;
  return (
    <section className="mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-semibold">{sl.name}</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {sl.items.map(i => (
          <div key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">{i.creator.name}</div>
            <div className="text-xs text-white/60">{i.creator.handle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
