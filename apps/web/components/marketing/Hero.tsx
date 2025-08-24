import WaitlistForm from './WaitlistForm';
import { WaitlistCount } from '@/app/(marketing)/_components/WaitlistCount';

export default function Hero() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 pt-24 text-center">
      <h1 className="max-w-3xl bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-7xl">
        Smarter, fairer brand deals.
      </h1>
      <p className="max-w-xl text-lg text-white/70">
        AI-powered brand-creator partnerships that value fit and fairness.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="/dashboard"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:translate-y-[1px] hover:bg-indigo-500"
        >
          I'm a Brand
        </a>
        <a
          href="/creator"
          className="rounded-xl border border-indigo-500/50 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:translate-y-[1px] hover:bg-indigo-500/10"
        >
          I'm a Creator
        </a>
      </div>
      <div className="mt-8 w-full max-w-md">
        <WaitlistForm source="hero-cta" />
      </div>
      <p className="mt-4 text-white/60">
        Join <WaitlistCount />+ creators &amp; brands
      </p>
    </section>
  );
}
