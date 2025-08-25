import Link from 'next/link';
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
        Smarter, fairer brand deals.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-300">
        AI-powered brand-creator partnerships that value fit and fairness.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-500"
        >
          I’m a Brand
        </Link>
        <Link
          href="/creator"
          className="rounded-lg bg-zinc-800 px-6 py-3 text-white transition hover:bg-zinc-700"
        >
          I’m a Creator
        </Link>
      </div>
      <div className="mt-10 w-full max-w-md">
        <WaitlistForm source="hero-cta" />
      </div>
    </section>
  );
}
