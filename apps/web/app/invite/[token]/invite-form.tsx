'use client';
import { signIn } from 'next-auth/react';

export default function InviteForm({ email, role }: { email: string; role: string }) {
  const handleGoogle = () => signIn('google');
  const handleGitHub = () => signIn('github');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Join Siora as a {role}</h1>
      <p>Email: {email}</p>
      <button onClick={handleGoogle} className="px-4 py-2 bg-blue-600 text-white rounded">Sign up with Google</button>
      <button onClick={handleGitHub} className="px-4 py-2 bg-gray-700 text-white rounded">Sign up with GitHub</button>
    </main>
  );
}
