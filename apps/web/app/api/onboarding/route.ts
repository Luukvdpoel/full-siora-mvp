import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { niche, goal } = await req.json();
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  const dbUser = await prisma.user.findUnique({
    where: { email },
    include: { brands: true },
  });
  if (!dbUser) return new Response("User not provisioned", { status: 400 });

  const brand = dbUser.brands[0];
  if (!brand) return new Response("No brand", { status: 400 });

  await prisma.brand.update({
    where: { id: brand.id },
    data: { niche, goal },
  });

  if (brand.credits < 20) {
    await prisma.brand.update({
      where: { id: brand.id },
      data: { credits: 20 },
    });
  }

  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: `${niche} campaign`,
      brief: `A starter campaign for ${niche} with goal: ${goal}.`,
      niche,
    },
  });

  return Response.json({ campaignId: campaign.id });
}

