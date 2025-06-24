import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { role } = await req.json();
  if (role !== "creator" && role !== "brand") {
    return new NextResponse("Invalid role", { status: 400 });
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { role } });
  return NextResponse.json({ ok: true });
}
