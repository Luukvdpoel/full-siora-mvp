import Link from 'next/link';

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">Siora</Link>
        <div className="hidden gap-6 text-sm md:flex">
          <Link href="#how" className="hover:text-indigo-500 transition-colors">How it works</Link>
          <Link href="#creators" className="hover:text-indigo-500 transition-colors">Creators</Link>
          <Link href="#brands" className="hover:text-indigo-500 transition-colors">Brands</Link>
          <Link href="/login" className="hover:text-indigo-500 transition-colors">Login</Link>
        </div>
      </nav>
    </header>
  );
}
