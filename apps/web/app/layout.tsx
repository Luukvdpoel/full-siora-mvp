"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { BrandUserProvider } from '../lib/brandUser';
import TrpcProvider from './trpcProvider';
import { PageTransition, Nav, NavLink, ThemeToggle } from 'shared-ui';
import { ThemeProvider } from './providers';
import * as React from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/shortlist', label: 'Shortlist' },
  { href: '/matches', label: 'Matches' },
  { href: '/inbox', label: 'Inbox' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-b from-Siora-dark via-Siora-mid to-Siora-light text-white font-sans antialiased">
        <ThemeProvider>
          <SessionProvider>
            <BrandUserProvider>
              <TrpcProvider>
                <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
                  <div className="flex justify-end mb-4">
                    <ThemeToggle />
                  </div>
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


