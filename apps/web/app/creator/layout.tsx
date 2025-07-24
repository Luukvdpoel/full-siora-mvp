import './globals.css';
// Use system fonts to avoid build-time Google font download
const inter = { className: '' };
import type { Metadata } from 'next';
import Providers from './providers';
import AuthStatus from '@creator/components/AuthStatus';
import ThemeToggle from '@creator/components/ThemeToggle';
import { ToastProvider } from '@creator/components/Toast';
import { PageTransition, Nav, NavLink } from 'shared-ui';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@creator/lib/auth';


export const metadata: Metadata = {
  title: 'Siora',
  description: 'Your identity, illuminated.',
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/creator/dashboard', label: 'Dashboard' },
  { href: '/creator/campaigns', label: 'Campaigns' },
  { href: '/creator/applications', label: 'Applications' },
  { href: '/creator/profile', label: 'Profile' },
  { href: '/dashboard', label: 'Brand View' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'creator') {
    redirect('/select-role');
  }
  return (
    <html lang="en" className={`${inter.className} dark scroll-smooth`}>
      <head>
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-Siora-dark via-Siora-mid to-Siora-light text-white font-sans antialiased">
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



