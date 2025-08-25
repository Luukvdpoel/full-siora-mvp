import { getBrand } from "@/lib/paywall";

export default async function CreditBadge() {
  const b = await getBrand();
  const n = b?.credits ?? 0;
  const low = n <= 10;
  return (
    <a
      href="/billing"
      className={`rounded-lg border px-2 py-1 text-xs ${
        low
          ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
          : "border-white/10 bg-white/5 text-white/80"
      }`}
    >
      Credits: <b className="ml-1">{n.toLocaleString()}</b>
      {low && <span className="ml-2 underline">Top up</span>}
    </a>
  );
}
