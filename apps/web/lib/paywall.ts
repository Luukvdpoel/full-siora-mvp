import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getBrand() {
  const { userId } = auth();
  if (!userId) return null;
  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress ?? "";
  return prisma.brand.findFirst({ where: { owner: { email } } });
}

/** true if paid plan */
export async function isPro() {
  const b = await getBrand();
  return b?.plan === "PRO";
}

/** throws if not enough credits */
export function assertCredits(credits: number, required: number) {
  if ((credits ?? 0) < required) {
    const err: any = new Error("Not enough credits");
    err.code = "INSUFFICIENT_CREDITS";
    err.required = required;
    err.remaining = credits ?? 0;
    throw err;
  }
}
