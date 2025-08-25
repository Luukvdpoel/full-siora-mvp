import { Suspense } from "react";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center gap-10 px-4">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
          Smarter, fairer brand deals.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70 mx-auto">
          AI-powered brand-creator partnerships that value fit and fairness.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/onboard/brand"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500 transition-all duration-300 hover:translate-y-[1px]"
          >
            I’m a Brand
          </a>
          <a
            href="/onboard/creator"
            className="rounded-lg bg-zinc-800 px-6 py-3 text-white hover:bg-zinc-700 transition-all duration-300 hover:translate-y-[1px]"
          >
            I’m a Creator
          </a>
        </div>
      </div>
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <WaitlistForm source="hero-cta" />
        </Suspense>
      </div>
    </section>
  );
}
