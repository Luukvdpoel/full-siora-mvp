import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const creators = await prisma.creator.findMany({
    take: 30,
    orderBy: { followers: "desc" },
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

  return <DashboardClient initialCreators={creators} />;
}

