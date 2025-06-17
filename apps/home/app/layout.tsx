import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Siora',
  description: 'Match with brands based on your vibe, not your follower count',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
