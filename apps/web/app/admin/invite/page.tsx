'use client';
import { useState } from 'react';

export default function AdminInvitePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'creator' | 'brand'>('creator');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/invite/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (res.ok) {
      setMsg('Invite sent');
      setEmail('');
    } else {
      setMsg('Error sending invite');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="space-y-4 bg-gray-100 p-6 rounded">
        <h1 className="text-xl font-semibold">Send Invite</h1>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded w-full" />
        <select value={role} onChange={e => setRole(e.target.value as 'creator' | 'brand')} className="border p-2 rounded w-full">
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        {msg && <p>{msg}</p>}
      </form>
    </main>
  );
}
