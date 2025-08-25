import "./globals.css";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthControls } from "@/components/AuthControls";
import { AnalyticsProvider, ThemeProvider } from "./providers";

export const metadata = {
  title: "Siora",
  description: "Creator x Brand matching by tone & values",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-gray-950 text-white">
        <body className="min-h-screen antialiased">
          <AnalyticsProvider>
            <ThemeProvider>
          <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold tracking-tight">
                Siora
              </Link>
              <div className="hidden gap-6 md:flex">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/shortlist">Shortlist</NavLink>
                <NavLink href="/billing">Billing & Credits</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
              </div>
              <div className="flex items-center gap-2">
                <AuthControls />
                <MobileMenu />
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-7xl px-4">{children}</main>
            <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60">
              <nav className="space-x-6 text-center">
                <a href="/about" className="hover:underline">About</a>
                <a href="/contact" className="hover:underline">Contact</a>
                <a href="/privacy" className="hover:underline">Privacy</a>
                <a href="/terms" className="hover:underline">Terms</a>
              </nav>
            </footer>
            </ThemeProvider>
          </AnalyticsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-2 py-1 text-white/80 hover:text-white hover:bg-white/5 data-[active=true]:text-white data-[active=true]:bg-white/10"
      data-active={
        typeof window !== "undefined" && window.location?.pathname === href
      }
      suppressHydrationWarning
    >
      {children}
    </Link>
  );
}

function MobileMenu() {
  return (
    <details className="md:hidden">
      <summary className="cursor-pointer rounded-lg px-2 py-1 text-white/80 hover:text-white hover:bg-white/5">
        Menu
      </summary>
      <div className="mt-2 flex flex-col rounded-xl border border-white/10 bg-gray-900 p-2">
        <Link className="rounded-lg px-2 py-2 hover:bg-white/5" href="/">
          Home
        </Link>
        <Link className="rounded-lg px-2 py-2 hover:bg-white/5" href="/dashboard">
          Dashboard
        </Link>
        <Link className="rounded-lg px-2 py-2 hover:bg-white/5" href="/shortlist">
          Shortlist
        </Link>
        <Link className="rounded-lg px-2 py-2 hover:bg-white/5" href="/billing">
          Billing & Credits
        </Link>
        <Link className="rounded-lg px-2 py-2 hover:bg-white/5" href="/pricing">
          Pricing
        </Link>
      </div>
    </details>
  );
}

