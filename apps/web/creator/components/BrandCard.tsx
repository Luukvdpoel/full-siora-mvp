import React from 'react';
import { useState, useEffect } from 'react';
import type { Brand } from '@creator/data/brands';
import type { PitchResult } from '@creator/types/pitch';

interface Props {
  brand: Brand;
  pitch?: PitchResult | null;
  loading?: boolean;
  onPitch: () => Promise<void>;
}

export default function BrandCard({ brand, pitch, loading, onPitch }: Props) {
  const [text, setText] = useState('');
  useEffect(() => {
    setText(pitch?.pitch ?? '');
  }, [pitch]);

  return (
    <div className="border border-white/10 bg-background p-4 rounded-xl space-y-3">
      <h3 className="text-lg font-bold">{brand.name}</h3>
      <p className="text-sm italic">Campaign: {brand.campaign}</p>
      <p className="text-sm text-foreground/80">{brand.summary}</p>
      <button
        onClick={onPitch}
        disabled={loading}
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Pitch Brand'}
      </button>
      {pitch && (
        <div className="space-y-2 mt-2">
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Copy Message
          </button>
        </div>
      )}
    </div>
  );
}
