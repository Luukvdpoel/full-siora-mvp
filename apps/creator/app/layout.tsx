import React from 'react';
import './globals.css';
import type { ReactNode } from 'react';
import { PageTransition, ThemeToggle } from 'shared-ui';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@lib/auth';

export const metadata = {
  title: 'Siora Creator',
  description: 'Creator tools for persona generation',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <div className="p-4 flex justify-between items-center">
          <nav className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/persona">Generate Persona</Link>
            <Link href="/dashboard">Affiliate Links</Link>
          </nav>
          <ThemeToggle />
        </div>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

