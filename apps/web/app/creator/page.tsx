'use client';
// Creator portal with streamlined Instagram connect and campaign matching
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadPersonasFromLocal, type StoredPersona } from '@creator/lib/localPersonas';
import { campaigns } from '@/app/data/campaigns';

export default function CreatorPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const persona = personas[0];

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">Creator Portal</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Connect</h2>
        <a href="/instagram/login" className="px-4 py-2 inline-block rounded bg-Siora-accent text-white">
          Connect Instagram
        </a>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Persona Summary</h2>
        {persona ? (
          <p className="text-sm text-foreground/80">{(persona.persona as any).summary}</p>
        ) : (
          <p>No persona yet. <Link href="/creator/generate" className="underline">Build one</Link>.</p>
        )}
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Matched Campaigns</h2>
        <ul className="space-y-2">
          {campaigns.slice(0,3).map(c => (
            <li key={c.id} className="border border-white/10 p-4 rounded">
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-foreground/80">{c.requirements}</p>
              <button className="mt-2 px-3 py-1 text-sm rounded bg-Siora-accent text-white">Apply</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
