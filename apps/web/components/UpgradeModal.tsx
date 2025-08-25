"use client";

export function UpgradeModal({ open, onClose, needed, remaining }:{
  open: boolean; onClose: () => void; needed?: number; remaining?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-950 p-5">
        <h3 className="text-lg font-semibold">You’ve run out of credits</h3>
        <p className="mt-2 text-sm text-white/70">
          {typeof needed === "number" ? `This action needs ~${needed} credits.` : null} You have {remaining ?? 0}.
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/pricing" className="rounded-xl bg-white/90 px-4 py-2 text-gray-900">Upgrade to Pro</a>
          <a href="/billing" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2">Buy credits</a>
          <button onClick={onClose} className="ml-auto text-sm text-white/60 underline">Close</button>
        </div>
      </div>
    </div>
  );
}
