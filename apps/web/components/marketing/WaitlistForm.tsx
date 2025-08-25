'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import posthog from 'posthog-js';

export default function WaitlistForm({ source }: { source?: string }) {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [igHandle, setIgHandle] = useState('');
  const [loading, setLoading] = useState(false);

  const utm = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = new URLSearchParams(utm as Record<string, string>);
      const res = await fetch(`/api/waitlist?${query.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, igHandle, source }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error('Failed');
      toast.success(
        `You're on the list!${process.env.NEXT_PUBLIC_RESEND ? ' Check your email.' : ''}`
      );
      posthog?.capture('waitlist_submitted', { role, source });
      setEmail('');
      setRole('');
      setIgHandle('');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm mb-1">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-black/40 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm mb-1">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md bg-black/40 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Select role</option>
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
      </div>
      <div>
        <label htmlFor="ig" className="block text-sm mb-1">Instagram handle</label>
        <input
          id="ig"
          value={igHandle}
          onChange={(e) => setIgHandle(e.target.value)}
          placeholder="@username"
          className="w-full rounded-md bg-black/40 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Joining…' : 'Join the waitlist'}
      </button>
    </form>
  );
}
