import React from "react";
import "./globals.css";
import type { ReactNode } from "react";
import { PageTransition, ThemeToggle } from "shared-ui";
import Link from "next/link";

export const metadata = {
  title: "Siora Creator",
  description: "Creator tools for persona generation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Siora Creator</title>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
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
