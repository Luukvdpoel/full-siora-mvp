import React from "react";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import AuthStatus from "@home/components/AuthStatus";
import { PageTransition, ThemeToggle } from "shared-ui";

export const metadata = {
  title: "Siora",
  description: "Match with brands based on your vibe, not your follower count",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Siora</title>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body className="font-sans">
        <Providers>
          <div className="p-4 flex justify-between">
            <AuthStatus />
            <ThemeToggle />
          </div>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
