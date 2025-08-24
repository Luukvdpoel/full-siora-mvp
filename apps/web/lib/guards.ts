import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getBrandForUser() {
  const { userId } = auth();
  if (!userId) return null;
  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress ?? "";
  return prisma.brand.findFirst({ where: { owner: { email } } });
}

export async function requirePro() {
  const brand = await getBrandForUser();
  return brand && brand.plan === "PRO" ? brand : null;
}
