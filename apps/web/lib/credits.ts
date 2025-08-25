import { prisma } from "@/lib/prisma";
import { trackServer } from "@/lib/analytics/server";

export async function getCredits(brandId: string) {
  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { credits: true } });
  return brand?.credits ?? 0;
}

// Increase credits (e.g., after purchase)
export async function addCredits(brandId: string, amount: number, note?: string) {
  if (amount <= 0) throw new Error("addCredits requires a positive amount");
  const updated = await prisma.$transaction(async (tx) => {
    const b = await tx.brand.update({
      where: { id: brandId },
      data: { credits: { increment: amount } },
    });
    await tx.creditLog.create({
      data: { brandId, action: "TOP_UP", amount, meta: note ? { note } : undefined },
    });
    return b;
  });
  await trackServer("credits_added", { brandId, amount });
  return updated.credits;
}

// Consume credits for an action (e.g., AI call)
export async function consumeCredits(
  brandId: string,
  amount: number,
  type: "AI_ANALYZE" | "AI_MATCH",
  note?: string,
) {
  if (amount <= 0) throw new Error("consumeCredits requires a positive amount");

  const res = await prisma.$transaction(async (tx) => {
    const b = await tx.brand.findUnique({ where: { id: brandId }, select: { credits: true } });
    if (!b) throw new Error("Brand not found");
    if ((b.credits ?? 0) < amount) {
      return { ok: false, remaining: b.credits ?? 0 } as const;
    }

    const updated = await tx.brand.update({
      where: { id: brandId },
      data: { credits: { decrement: amount } },
    });

    await tx.creditLog.create({
      data: {
        brandId,
        action: type,
        amount: -amount,
        meta: note ? { note } : undefined,
      },
    });

    return { ok: true, remaining: updated.credits } as const;
  });

  if (res.ok) {
    await trackServer("credits_consumed", { brandId, amount, action: type });
  }
  return res;
}
