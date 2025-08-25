import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
export async function POST(req: Request) {
  const { shortlistId } = await req.json();
  const shareId = randomBytes(6).toString("hex");
  await prisma.shortlist.update({ where: { id: shortlistId }, data: { shareId } });
  return Response.json({ url: `/s/${shareId}` });
}
