'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadPersonasFromLocal, type StoredPersona } from '@creator/lib/localPersonas';
import { brands } from '@creator/data/brands';

export default function CreatorDashboard() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">Creator Dashboard</h1>
      {personas.length === 0 ? (
        <p>
          No personas found.{' '}
          <Link href="/creator/generate" className="underline">
            Generate one
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Personas</h2>
          <ul className="space-y-2">
            {personas.map((p, idx) => (
              <li key={idx} className="border border-white/10 p-4 rounded">
                <p className="font-semibold">{(p.persona as any).name || `Persona ${idx + 1}`}</p>
                {(p.persona as any).summary && (
                  <p className="text-sm text-foreground/80">{(p.persona as any).summary}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Brand Opportunities</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {brands.slice(0, 4).map((brand) => (
            <li key={brand.id} className="border border-white/10 p-4 rounded">
              <p className="font-semibold">{brand.name}</p>
              <p className="text-sm text-foreground/80">{brand.summary}</p>
            </li>
          ))}
        </ul>
        <Link href="/creator/brands" className="underline">
          View all brands
        </Link>
      </div>
      <div>
        <Link href="/creator/generate" className="px-4 py-2 mt-4 inline-block rounded bg-indigo-600 text-white">
          Generate New Persona
        </Link>
      </div>
    </main>
  );
}
