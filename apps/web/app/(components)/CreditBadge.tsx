import { getBrandForUser } from "@/lib/guards";

export default async function CreditBadge() {
  const brand = await getBrandForUser();
  const credits = brand?.credits ?? 0;
  return (
    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
      Credits: <b className="ml-1">{credits.toLocaleString()}</b>
    </span>
  );
}
