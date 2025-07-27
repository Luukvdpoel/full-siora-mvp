import React from "react";
import "../globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "../providers";
import { PageTransition, ThemeToggle } from "shared-ui";

export const metadata = {
  title: "Siora – Marketing",
  description: "Match with aligned creators or brands using AI personas",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Siora – Marketing</title>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <div className="p-4 flex justify-end">
            <ThemeToggle />
          </div>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
