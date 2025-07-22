'use client';
import { useEffect, useState } from 'react';
import type { BrandProfile } from '../../packages/shared-utils/src/fitScoreEngine';

export function useBrandPrefs() {
  const [prefs, setPrefs] = useState<BrandProfile | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('brandPrefs');
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  return prefs;
}
