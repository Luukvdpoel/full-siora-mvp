import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
// @ts-expect-error Server Component
import CreditBadge from "@/app/(components)/CreditBadge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="text-lg font-semibold">Siora</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-white/80 hover:text-white">Dashboard</Link>
            <Link href="/campaigns" className="text-white/80 hover:text-white">Campaigns</Link>
            <Link href="/shortlist" className="text-white/80 hover:text-white">Shortlist</Link>
            <Link href="/billing" className="text-white/80 hover:text-white">Billing</Link>
            <CreditBadge />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="rounded-xl bg-white px-3 py-1.5 text-gray-900">Login</Link>
            </SignedOut>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
