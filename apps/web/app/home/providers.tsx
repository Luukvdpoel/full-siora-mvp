import React from 'react';
"use client";
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';
import { ThemeProvider } from '../providers';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
