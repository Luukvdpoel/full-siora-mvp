import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) return null;

  const cUser = await currentUser();
  const email = cUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const _dbUser = await prisma.user.findUnique({
    where: { email },
    include: { brands: true },
  });

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

