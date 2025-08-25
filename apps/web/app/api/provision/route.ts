import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export async function POST() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "User";

  if (!email) return new Response("No email", { status: 400 });

  const user = await prisma.user.upsert({
    where: { email },
    update: { authId: userId, name },
    create: { email, name, authId: userId, role: "BRAND" },
  });

  let brand = await prisma.brand.findFirst({ where: { ownerId: user.id } });
  if (!brand) {
    brand = await prisma.brand.create({
      data: { ownerId: user.id, name: `${name.split(" ")[0]}'s Brand`, plan: "FREE", credits: 20 },
    });
    await prisma.referral.create({
      data: {
        code: "u_" + nanoid(8),
        referrerId: brand.id,
      },
    });
  } else if ((brand.credits ?? 0) === 0 && brand.plan === "FREE") {
    await prisma.brand.update({ where: { id: brand.id }, data: { credits: 20 } });
  }

  const ref = cookies().get("referral")?.value;
  if (ref) {
    const r = await prisma.referral.findUnique({ where: { code: ref } });
    if (r && !r.referredBrandId) {
      await prisma.referral.update({ where: { code: ref }, data: { referredBrandId: brand.id } });
    }
  }

  return Response.json({ ok: true });
}
