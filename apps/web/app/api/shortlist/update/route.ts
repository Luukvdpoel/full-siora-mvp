import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { itemId, status, note } = await req.json();
  await prisma.shortlistItem.update({ where: { id: itemId }, data: { status, note } });
  return Response.json({ ok: true });
}
