"use client";
import React from 'react';

import { useEffect, useState } from "react";
import PersonaCard from "@creator/components/PersonaCard";
import type { PersonaProfile } from "@creator/types/persona";
import { loadPersonasFromLocal, StoredPersona } from "@creator/lib/localPersonas";

export default function PersonasPage() {
  const [items, setItems] = useState<StoredPersona[]>([]);

  useEffect(() => {
    setItems(loadPersonasFromLocal());
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      <h1 className="text-2xl font-bold">My Personas</h1>
      {items.length === 0 ? (
        <p className="text-foreground/60">No saved personas found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <PersonaCard profile={item.persona as PersonaProfile} />
              <p className="text-xs text-foreground/60">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
