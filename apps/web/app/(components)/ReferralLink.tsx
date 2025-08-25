import ReferralLinkClient from "@/components/ReferralLinkClient";
import { getBrand } from "@/lib/paywall";
import { prisma } from "@/lib/prisma";

export default async function ReferralLink() {
  const brand = await getBrand();
  if (!brand) return null;
  const ref = await prisma.referral.findFirst({ where: { referrerId: brand.id } });
  if (!ref) return null;
  return <ReferralLinkClient code={ref.code} />;
}
