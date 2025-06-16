"use client";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import ThemeProvider from "./theme-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
