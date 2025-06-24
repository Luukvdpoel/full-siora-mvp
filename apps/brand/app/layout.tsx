"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { BrandUserProvider } from '@/lib/brandUser';
import TrpcProvider from '@/lib/trpcProvider';
import { PageTransition } from 'shared-ui';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-Siora-dark dark:text-white font-sans antialiased min-h-screen">
        <SessionProvider>
          <TrpcProvider>
            <BrandUserProvider>
              <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
                <PageTransition>{children}</PageTransition>
              </main>
            </BrandUserProvider>
          </TrpcProvider>
        </SessionProvider>
      </body>
    </html>
  );
}


