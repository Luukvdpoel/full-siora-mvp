"use client";
export function LowCreditBanner({ remaining }: { remaining: number }) {
  if (remaining > 10) return null;
  return (
    <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
      You're low on credits ({remaining}). <a className="underline" href="/billing">Buy a pack</a> or <a className="underline" href="/pricing">Upgrade to Pro</a>.
    </div>
  );
}
