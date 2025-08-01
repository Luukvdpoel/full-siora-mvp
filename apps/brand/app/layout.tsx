"use client";
import React from "react";
import "./globals.css";
import type { ReactNode } from "react";
import { Nav, NavLink, PageTransition, ThemeToggle } from "shared-ui";

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create-brief", label: "Create Brief" },
  { href: "/inbox", label: "Inbox" },
  { href: "/creator", label: "Creator View" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Siora Brand Portal</title>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-Siora-dark via-Siora-mid to-Siora-light text-white font-sans antialiased">
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <Nav links={navLinks} />
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
