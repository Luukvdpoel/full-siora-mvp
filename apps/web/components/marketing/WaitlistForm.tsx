'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import posthog from 'posthog-js';

interface Props {
  source?: string;
}

export default function WaitlistForm({ source }: Props) {
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [igHandle, setIgHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitted) return;
    setLoading(true);
    try {
      const body = {
        email,
        role: role || undefined,
        igHandle: igHandle || undefined,
        source,
      };
      const qs = new URLSearchParams({
        utm_source: search.get('utm_source') || '',
        utm_medium: search.get('utm_medium') || '',
        utm_campaign: search.get('utm_campaign') || '',
      });
      const res = await fetch(`/api/waitlist?${qs.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setSubmitted(true);
      toast.success(json.emailSent ? 'Check your email!' : 'Added to waitlist');
      posthog?.capture('waitlist_submitted', { role, source });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <p className="text-center text-sm text-white/70">Thanks for joining!</p>;
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-left shadow-xl">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-white/70 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">Role (optional)</option>
          <option value="brand">Brand</option>
          <option value="creator">Creator</option>
        </select>
        <input
          type="text"
          value={igHandle}
          onChange={e => setIgHandle(e.target.value)}
          placeholder="Instagram handle"
          className="w-full rounded-md border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:translate-y-[1px] hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join waitlist'}
        </button>
      </form>
      <Toaster />
    </>
  );
}
