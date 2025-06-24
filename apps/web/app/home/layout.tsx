import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';
import AuthStatus from '../components/AuthStatus';
import { PageTransition } from 'shared-ui';

export const metadata = {
  title: 'Siora',
  description: 'Match with brands based on your vibe, not your follower count',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <div className="p-4 flex justify-end">
            <AuthStatus />
          </div>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
