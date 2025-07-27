"use client";
import "./globals.css";
import { Inter } from 'next/font/google';
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { BrandUserProvider } from "../lib/brandUser";
import TrpcProvider from "./trpcProvider";
import { PageTransition, Nav, NavLink, ThemeToggle } from "shared-ui";
import AuthStatus from "../components/AuthStatus";
import Footer from "../components/Footer";
import { ThemeProvider } from "./providers";
import PostHogProvider from "../components/PostHogProvider";
import { Analytics } from "@vercel/analytics/react";
import * as React from "react";
const inter = Inter({ subsets: ['latin'] });
import {
  LayoutDashboard,
  Heart,
  Users2,
  BarChart,
  Mail,
  CreditCard,
  ShieldCheck,
  ScrollText,
  User,
  Home as HomeIcon,
} from "lucide-react";

const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shortlist", label: "Shortlist", icon: Heart },
  { href: "/matches", label: "Matches", icon: Users2 },
  { href: "/creator", label: "Creator View", icon: User },
  { href: "/brand", label: "Brand Portal", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/inbox", label: "Inbox", icon: Mail },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/privacy", label: "Privacy", icon: ShieldCheck },
  { href: "/terms", label: "Terms", icon: ScrollText },
  { href: "https://tally.so/r/xyz123", label: "Feedback" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <head>
        <title>Siora Dashboard</title>
        <meta name="description" content="Siora brand dashboard" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body className="min-h-screen bg-Siora-dark text-white antialiased">
        <ThemeProvider>
          <PostHogProvider />
          <Analytics />
          <SessionProvider>
            <BrandUserProvider>
              <TrpcProvider>
                <header className="sticky top-0 z-50 bg-black/70 backdrop-blur">
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex justify-between items-center">
                    <a href="/" className="font-bold text-white text-lg">Siora</a>
                    <div className="flex items-center gap-4">
                      <Nav links={navLinks} />
                      <AuthStatus />
                      <ThemeToggle />
                    </div>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
              </TrpcProvider>
            </BrandUserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
