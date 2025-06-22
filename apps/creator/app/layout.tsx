import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';
import AuthStatus from '@/components/AuthStatus';
import ThemeToggle from '@/components/ThemeToggle';
import { ToastProvider } from '../../../components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Siora',
  description: 'Your identity, illuminated.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Providers>
            <div className="p-4 flex justify-between items-center">
              <ThemeToggle />
              <AuthStatus />
            </div>
            {children}
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}



