import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-nura-dark text-white font-sans antialiased min-h-screen">
        <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">{children}</main>
      </body>
    </html>
  );
}


