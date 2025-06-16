"use client";
import { useEffect, useState } from "react";
import PersonaInsights from "@/components/PersonaInsights";
import { loadPersonasFromLocal, StoredPersona } from "@/lib/localPersonas";
import type { FullPersona } from "@/types/persona";

export default function DashboardPage() {
  const [items, setItems] = useState<StoredPersona[]>([]);

  useEffect(() => {
    setItems(loadPersonasFromLocal());
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {items.length === 0 ? (
        <p className="text-foreground/60">No personas found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <PersonaInsights persona={item.persona as FullPersona} />
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
