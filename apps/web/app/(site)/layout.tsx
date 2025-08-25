import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-lg font-semibold">Siora</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="text-white/80 hover:text-white">Pricing</Link>
            <Link href="/waitlist" className="text-white/80 hover:text-white">Waitlist</Link>
            <Link href="/sign-in" className="rounded-xl bg-white px-3 py-1.5 text-gray-900 hover:bg-gray-200">Login</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
          © {new Date().getFullYear()} Siora · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link>
        </div>
      </footer>
    </>
  );
}
