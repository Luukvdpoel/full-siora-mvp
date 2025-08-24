'use client';
import posthog from 'posthog-js';

export default function Pricing() {
  return (
    <section className="mx-auto max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-white/70">Start free. Upgrade when ready.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-1 text-white/70">Browse sample creators</p>
          <a
            href="/dashboard"
            className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5"
            onClick={() => posthog.capture('pricing_continue')}
          >
            Continue
          </a>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-1 text-white/70">Full search, shortlist, export</p>
          <button
            className="mt-4 rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white"
            onClick={() => posthog.capture('upgrade_click')}
          >
            Upgrade
          </button>
        </div>
      </div>
    </section>
  );
}

