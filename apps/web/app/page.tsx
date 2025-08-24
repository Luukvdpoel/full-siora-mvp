'use client';
import posthog from 'posthog-js';

export default function Home() {
  return (
    <section className="grid min-h-[70vh] place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Match brands & creators by <span className="text-white/70">tone</span> and <span className="text-white/70">values</span>.
        </h1>
        <p className="mt-4 text-white/70">
          Not just follower count. Siora analyzes fit and outreach quality to help campaigns convert.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5"
            onClick={() => posthog.capture('try_demo')}
          >
            Try the demo
          </a>
          <a
            href="/pricing"
            className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white"
            onClick={() => posthog.capture('get_started')}
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}

