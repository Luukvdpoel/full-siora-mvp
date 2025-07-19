"use client";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { BrandUserProvider } from "../lib/brandUser";
import TrpcProvider from "./trpcProvider";
import { PageTransition, Nav, NavLink } from "shared-ui";
import { ThemeProvider } from "./providers";
import { Inter } from "next/font/google";
import * as React from "react";

const inter = Inter({ subsets: ["latin"] });

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/shortlist', label: 'Shortlist' },
  { href: '/matches', label: 'Matches' },
  { href: '/inbox', label: 'Inbox' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white text-black dark:bg-Siora-dark dark:text-white font-sans antialiased min-h-screen`}
      >
        <ThemeProvider>
          <SessionProvider>
            <BrandUserProvider>
              <TrpcProvider>
                <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
                  <Nav links={navLinks} />
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


