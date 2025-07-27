'use client';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import AuthGuard from './AuthGuard';
import { useGeneratePersona } from '@creator/lib/useGeneratePersona';
import { loadPersonasFromLocal, savePersonaToLocal } from '@creator/lib/localPersonas';
import { loadProfileSettings } from '@creator/lib/profileSettings';
import type { PersonaProfile } from '@creator/types/persona';
import Link from 'next/link';

export default function CreatorPage() {
  return (
    <SessionProvider>
      <Toaster />
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    </SessionProvider>
  );
}

function Dashboard() {
  const { generate, loading, persona, setPersona } = useGeneratePersona();
  const [pitch, setPitch] = useState('');
  const [pitchLoading, setPitchLoading] = useState(false);

  useEffect(() => {
    const list = loadPersonasFromLocal();
    if (list.length > 0) setPersona(list[0].persona as PersonaProfile);
    if (typeof window !== 'undefined') {
      const storedPitch = localStorage.getItem('creatorPitch');
      if (storedPitch) setPitch(storedPitch);
    }
  }, [setPersona]);

  const handleGeneratePersona = async () => {
    const settings = loadProfileSettings();
    const bio = settings?.bio || '';
    if (!bio) {
      toast.error('No intro found in profile settings');
    }
    const result = await generate({ captions: [bio || ''] });
    if (result) {
      savePersonaToLocal(result);
      toast.success('Persona generated');
    }
  };

  const handleGeneratePitch = async () => {
    if (!persona) {
      toast.error('Generate persona first');
      return;
    }
    setPitchLoading(true);
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, brand: 'Generic Brand' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate pitch');
      setPitch(data.pitch as string);
      if (typeof window !== 'undefined') {
        localStorage.setItem('creatorPitch', data.pitch as string);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error generating pitch');
    } finally {
      setPitchLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 space-y-8">
      <h1 className="text-2xl font-bold text-indigo-400">Creator Dashboard</h1>

      <section className="rounded-xl border border-gray-800 p-6 bg-gray-900/80 shadow-md space-y-4">
        <h2 className="text-xl font-semibold">🎯 Your Persona</h2>
        {persona ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Age:</span> {(persona as any).age || 'N/A'}</p>
            <p><span className="font-semibold">Tone:</span> {(persona as any).tone || 'N/A'}</p>
            <p><span className="font-semibold">Personality:</span> {persona.personality || 'N/A'}</p>
            <p><span className="font-semibold">Strengths:</span> {(persona.interests || []).join(', ') || 'N/A'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Generate a persona to get tailored brand opportunities.</p>
            <button onClick={handleGeneratePersona} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-4 py-2" disabled={loading}>
              {loading ? 'Generating...' : 'Generate My Persona'}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 p-6 bg-gray-900/80 shadow-md space-y-4">
        <h2 className="text-xl font-semibold">🧠 Your Brand Pitch</h2>
        {pitch ? (
          <textarea
            className="w-full p-2 bg-gray-800 rounded text-white"
            rows={6}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          />
        ) : (
          <p className="text-sm">Generate a short pitch to introduce yourself to brands.</p>
        )}
        <button onClick={handleGeneratePitch} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-4 py-2" disabled={pitchLoading}>
          {pitchLoading ? 'Generating...' : pitch ? 'Refine Pitch' : 'Generate Pitch'}
        </button>
      </section>

      <section className="rounded-xl border border-gray-800 p-6 bg-gray-900/80 shadow-md space-y-2">
        <h2 className="text-xl font-semibold">🛠 Tools &amp; Settings</h2>
        <div className="flex flex-col gap-2 text-indigo-400">
          <Link href="/creator/settings" className="underline">Update Profile</Link>
          <Link href="/creator/signin" className="underline">Connect Instagram Again</Link>
          <Link href="/creator/contact" className="underline">Contact Support</Link>
        </div>
      </section>
    </main>
  );
}
