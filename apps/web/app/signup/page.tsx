import React, { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-4 py-20">
      <div className="bg-Siora-mid p-8 rounded-xl w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">Join Siora</h1>
        <p className="text-zinc-300">Sign up to get early access to the platform.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <button
            type="submit"
            className="w-full py-2 bg-Siora-accent hover:bg-Siora-accent-soft rounded-lg font-semibold"
          >
            Join Waitlist
          </button>
        </form>
        {status === 'success' && <p className="text-green-400">Thanks! We'll be in touch.</p>}
        {status === 'error' && <p className="text-red-400">Something went wrong. Try again.</p>}
      </div>
    </main>
  );
}
