import { getBrand } from "@/lib/paywall";
import ShortlistPageClient from "./ShortlistPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShortlistPage() {
  const brand = await getBrand();
  return <ShortlistPageClient remaining={brand?.credits ?? 0} plan={brand?.plan ?? "FREE"} />;
}
