import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const tone = searchParams.get("tone");
  const niche = searchParams.get("niche");
  const minFollowers = Number(searchParams.get("minFollowers") ?? 0);
  const maxFollowers = Number(searchParams.get("maxFollowers") ?? 1_000_000);
  const take = Math.min(Number(searchParams.get("take") ?? 24), 100);
  const cursor = searchParams.get("cursor") ?? undefined;

  const where: any = {
    followers: { gte: minFollowers, lte: maxFollowers },
    ...(tone && tone !== "Any" ? { tone } : {}),
    ...(niche && niche !== "Any" ? { niche } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { handle: { contains: q, mode: "insensitive" } },
            { niche: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const data = await prisma.creator.findMany({
    where,
    orderBy: { followers: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      name: true,
      handle: true,
      niche: true,
      tone: true,
      values: true,
      followers: true,
      avgViews: true,
      engagement: true,
      location: true,
    },
  });

  const nextCursor = data.length === take ? data[data.length - 1].id : null;
  return Response.json({ data, nextCursor });
}

