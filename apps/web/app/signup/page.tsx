import React, { useState } from 'react';
import { Hero } from 'shared-ui';

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
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-4 py-20">
      <Hero
        title="Join Siora"
        subtitle="Sign up to get early access to the platform"
        cta={
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
              className="w-full py-2 bg-Siora-accent hover:bg-Siora-accent-soft rounded-lg font-semibold transition-all duration-300"
            >
              Join Waitlist
            </button>
            {status === 'success' && <p className="text-green-400 mt-2">Thanks! We'll be in touch.</p>}
            {status === 'error' && <p className="text-red-400 mt-2">Something went wrong. Try again.</p>}
          </form>
        }
      />
    </main>
  );
}
