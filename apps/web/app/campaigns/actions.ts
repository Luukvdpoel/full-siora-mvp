"use server";

import { z } from "zod";
import { revalidatePath, redirect } from "next/navigation";
import { CampaignSchema } from "@/lib/campaigns";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

async function getOwnerBrandId() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress ?? "";
  const brand = await prisma.brand.findFirst({
    where: { owner: { email } },
    select: { id: true },
  });
  if (!brand) throw new Error("Brand not found");
  return brand.id;
}

export async function createCampaign(prevState: any, formData: FormData) {
  const brandId = await getOwnerBrandId();
  const raw = Object.fromEntries(formData.entries());
  const parsed = CampaignSchema.safeParse({
    title: raw.title,
    brief: raw.brief,
    niche: raw.niche,
    targetTone: raw.targetTone,
    budgetEUR: raw.budgetEUR,
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { title, brief, niche, targetTone, budgetEUR } = parsed.data;
  const c = await prisma.campaign.create({
    data: { brandId, title, brief, niche, targetTone, budgetEUR },
  });

  revalidatePath("/campaigns");
  redirect(`/campaigns/${c.id}/matches`);
}

export async function updateCampaign(
  campaignId: string,
  prevState: any,
  formData: FormData,
) {
  await getOwnerBrandId();
  const raw = Object.fromEntries(formData.entries());
  const parsed = CampaignSchema.safeParse({
    title: raw.title,
    brief: raw.brief,
    niche: raw.niche,
    targetTone: raw.targetTone,
    budgetEUR: raw.budgetEUR,
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { title, brief, niche, targetTone, budgetEUR } = parsed.data;
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { title, brief, niche, targetTone, budgetEUR },
  });

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}/matches`);
}

export async function deleteCampaign(campaignId: string) {
  await getOwnerBrandId();
  await prisma.match.deleteMany({ where: { campaignId } });
  await prisma.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/campaigns");
  redirect("/campaigns");
}

