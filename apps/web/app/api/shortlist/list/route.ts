import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress;
  if (!email) return new Response("Unauthorized", { status: 401 });
  const brand = await prisma.brand.findFirst({ where: { owner: { email } } });
  if (!brand) return new Response("Brand not found", { status: 404 });

  let sl = await prisma.shortlist.findFirst({ where: { brandId: brand.id }, include: { items: { include: { creator: true } } } });
  if (!sl) sl = await prisma.shortlist.create({ data: { brandId: brand.id, name: "My Shortlist" } });

  return Response.json(sl);
}
