'use client';
import { useEffect, useState } from 'react';

interface Props { code: string }

export default function CallbackClient({ code }: Props) {
  const [status, setStatus] = useState('Processing...');
  useEffect(() => {
    if (!code) {
      setStatus('Missing code');
      return;
    }
    fetch('/api/instagram/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(() => setStatus('Instagram connected'))
      .catch(() => setStatus('Authentication failed'));
  }, [code]);
  return <p className="p-4">{status}</p>;
}
