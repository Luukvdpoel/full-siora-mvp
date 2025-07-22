'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <button onClick={() => signIn()} className="underline text-sm">
        Sign In
      </button>
    );
  }

  return (
    <button onClick={() => signOut()} className="underline text-sm">
      Sign Out
    </button>
  );
}
