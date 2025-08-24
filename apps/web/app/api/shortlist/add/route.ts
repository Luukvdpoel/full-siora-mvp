import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { creatorId } = await req.json();
  if (!creatorId)
    return new Response(JSON.stringify({ error: "creatorId required" }), {
      status: 400,
    });

  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress;
  if (!email)
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  const brand = await prisma.brand.findFirst({ where: { owner: { email } } });
  if (!brand)
    return new Response(JSON.stringify({ error: "Brand not found" }), {
      status: 404,
    });

  let shortlist = await prisma.shortlist.findFirst({ where: { brandId: brand.id } });
  if (!shortlist) {
    shortlist = await prisma.shortlist.create({
      data: { brandId: brand.id, name: "My Shortlist" },
    });
  }

  await prisma.shortlistItem.upsert({
    where: { shortlistId_creatorId: { shortlistId: shortlist.id, creatorId } },
    update: {},
    create: { shortlistId: shortlist.id, creatorId },
  });

  return Response.json({ ok: true });
}
