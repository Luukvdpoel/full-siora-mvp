import './globals.css';
// Disabled remote font download for offline builds
const inter = { className: '' };
import type { Metadata } from 'next';
import Providers from './providers';
import AuthStatus from '@creator/components/AuthStatus';
import ThemeToggle from '@creator/components/ThemeToggle';
import { ToastProvider } from '@creator/components/Toast';
import { PageTransition, Nav, NavLink } from 'shared-ui';


export const metadata: Metadata = {
  title: 'Siora',
  description: 'Your identity, illuminated.',
};

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/applications', label: 'Applications' },
  { href: '/profile', label: 'Profile' },
];

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
        <Providers>
          <ToastProvider>
            <div className="p-4 flex justify-between items-center">
              <ThemeToggle />
              <AuthStatus />
            </div>
            <Nav links={navLinks} />
            <PageTransition>{children}</PageTransition>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}



