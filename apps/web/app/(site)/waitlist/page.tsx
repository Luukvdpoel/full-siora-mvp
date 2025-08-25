"use client";
import { useState } from "react";

export default function WaitlistPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = (e.target as HTMLFormElement).email.value;
    const r = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (r.ok) setDone(true);
  }

  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        {done ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold">🎉 Bedankt!</h1>
            <p className="mt-2 text-white/70">Je staat op de waitlist. We mailen je zodra we openen.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Join the waitlist</h1>
            <p className="mt-2 text-white/70">We geven je vroegtijdig toegang en extra credits bij launch.</p>
            <form onSubmit={submit} className="mt-5 flex gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="you@brand.com"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
              />
              <button
                disabled={loading}
                className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Join"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
