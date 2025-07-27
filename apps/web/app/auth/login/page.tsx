'use client'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import InstagramLoginButton from '@/components/instagram/InstagramLoginButton';

export default function LoginPage() {
  const [role, setRole] = useState<'brand' | 'creator'>('brand');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-background text-foreground">
      <div className="flex gap-4">
        <button
          onClick={() => setRole('brand')}
          className={`px-4 py-2 rounded ${role === 'brand' ? 'bg-indigo-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}
        >
          Login as Brand
        </button>
        <button
          onClick={() => setRole('creator')}
          className={`px-4 py-2 rounded ${role === 'creator' ? 'bg-indigo-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}
        >
          Login as Creator
        </button>
      </div>
      {role === 'brand' ? (
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Continue with Google
        </button>
      ) : (
        <InstagramLoginButton />
      )}
    </main>
  );
}
