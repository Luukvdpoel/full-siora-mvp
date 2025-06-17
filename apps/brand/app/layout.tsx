import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-Siora-dark dark:text-white font-sans antialiased min-h-screen">
        <Providers>
          <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}


