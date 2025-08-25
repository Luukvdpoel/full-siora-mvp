import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { outreachId, status } = await req.json(); // "sent" | "replied"
  const data: any = { status };
  if (status === "sent") data.sentAt = new Date();
  if (status === "replied") data.replyAt = new Date();
  await prisma.outreach.update({ where: { id: outreachId }, data });
  return Response.json({ ok: true });
}
