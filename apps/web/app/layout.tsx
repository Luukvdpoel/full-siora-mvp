import React from 'react';
"use client";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { BrandUserProvider } from "../lib/brandUser";
import TrpcProvider from "./trpcProvider";
import { PageTransition, Nav, NavLink, ThemeToggle } from "shared-ui";
import AuthStatus from "../components/AuthStatus";
import { ThemeProvider } from "./providers";
import { Inter } from "next/font/google";
import * as React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import {
  Gauge,
  Heart,
  Sparkles,
  BarChart2,
  Mail,
  CreditCard,
  FileText,
  StickyNote,
} from "lucide-react";

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/shortlist", label: "Shortlist", icon: Heart },
  { href: "/matches", label: "Matches", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/inbox", label: "Inbox", icon: Mail },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/privacy", label: "Privacy", icon: FileText },
  { href: "/terms", label: "Terms", icon: StickyNote },
  { href: "https://tally.so/r/xyz123", label: "Feedback", icon: StickyNote },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <head>
        <title>Siora Dashboard</title>
        <meta name="description" content="Siora brand dashboard" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-Siora-dark via-Siora-mid to-Siora-light text-white font-sans antialiased">
        <ThemeProvider>
          <SessionProvider>
            <BrandUserProvider>
              <TrpcProvider>
                <header className="sticky top-0 z-50 backdrop-blur bg-Siora-dark/80 border-b border-Siora-border">
                  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
                    <Nav links={navLinks} />
                    <div className="flex items-center gap-4">
                      <AuthStatus />
                      <ThemeToggle />
                    </div>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
                  <PageTransition>{children}</PageTransition>
                </main>
              </TrpcProvider>
            </BrandUserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
