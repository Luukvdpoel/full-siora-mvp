'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'shared-ui';

export default function AuthGuard({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login');
    if (status === 'authenticated') {
      if (!session || (session.user as { role?: string }).role !== 'creator') {
        router.replace('/auth/login');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <Spinner />
      </div>
    );
  }

  if (!session || (session.user as { role?: string }).role !== 'creator') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Access denied
      </main>
    );
  }

  return <>{children}</>;
}
