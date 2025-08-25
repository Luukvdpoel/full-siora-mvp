'use client';
import React from 'react';

import { useEffect, useState } from "react";
import type { PersonaProfile } from "@creator/types/persona";

interface StoredPersona {
  title: string;
  persona: string | PersonaProfile;
  timestamp: string;
}

export default function SavedPage() {
  const [items, setItems] = useState<StoredPersona[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/personas");
        const data = await res.json();
        if (Array.isArray(data)) setItems(data as StoredPersona[]);
      } catch (err) {
        console.error("Failed to load personas", err);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <h1 className="text-2xl font-bold">Saved Personas</h1>
      {items.length === 0 ? (
        <p className="text-foreground/60">No saved personas.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={idx} className="border p-4 rounded-md">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-foreground/60">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
