"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { loadPersonasFromLocal, StoredPersona } from '@creator/lib/localPersonas';
import { brands, type Brand } from '@creator/data/brands';
import BrandCard from '@creator/components/BrandCard';
import type { PitchResult } from '@creator/types/pitch';

export default function BrandsPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pitches, setPitches] = useState<Record<string, PitchResult | null>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setPersonas(loadPersonasFromLocal());
  }, []);

  const handlePitch = async (brand: Brand) => {
    if (!personas[selectedIndex]) return;
    setLoadingId(brand.id);
    try {
      const res = await fetch('/api/brand-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: personas[selectedIndex].persona, brand }),
      });
      const data = await res.json();
      if (res.ok) {
        setPitches((prev) => ({ ...prev, [brand.id]: data as PitchResult }));
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (personas.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <p>No saved personas found. Generate one first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Brand Opportunities</h1>
      <div>
        <label className="block text-sm font-semibold mb-1">Select Persona</label>
        <select
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
        >
          {personas.map((p, idx) => (
            <option key={idx} value={idx}>
              {(p.persona as { name?: string }).name || `Persona ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            pitch={pitches[brand.id]}
            loading={loadingId === brand.id}
            onPitch={() => handlePitch(brand)}
          />
        ))}
      </div>
    </main>
  );
}
