'use client';
import { useEffect, useState } from "react";

export function useShortlist(user: string | null) {
  const key = user ? `shortlist:${user}` : "shortlist";
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setIds(parsed);
      } catch {}
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(ids));
  }, [ids, key]);

  const toggle = (id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const inShortlist = (id: string) => ids.includes(id);

  return { ids, toggle, inShortlist };
}
