"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PersonaCard from "@creator/components/PersonaCard";
import PerformanceMetrics from "@creator/components/PerformanceMetrics";
import type { PersonaProfile } from "@creator/types/persona";
import { useToast } from "@creator/components/Toast";

interface PersonaRecord {
  id: string;
  title: string;
  data: PersonaProfile;
  createdAt: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<PersonaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/personas");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setItems(data as PersonaRecord[]);
        }
      } catch (err) {
        console.error("Failed to load personas", err);
        toast("Failed to load personas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this persona?")) return;
    try {
      await fetch(`/api/personas/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete persona", err);
      toast("Failed to delete persona");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <nav className="flex gap-4 text-sm">
        <Link href="/dashboard" className="underline">
          Personas
        </Link>
        <Link href="/campaigns" className="underline">
          Campaigns
        </Link>
        <Link href="/applications" className="underline">
          My Applications
        </Link>
        <Link href="/my-campaigns" className="underline">
          My Campaigns
        </Link>
        <Link href="/collabs" className="underline">
          Collabs
        </Link>
        <Link href="/performance" className="underline">
          Performance
        </Link>
        <Link href="/pitch" className="underline">
          Pitch
        </Link>
        <Link href="/dashboard/lead-magnet" className="underline">
          Lead Magnet
        </Link>
      </nav>
      <PerformanceMetrics />
      {items.length === 0 ? (
        <p className="text-foreground/60">{loading ? "Loading..." : "No personas found."}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="space-y-2 border border-white/10 p-4 rounded-xl">
              <PersonaCard profile={item.data} />
              <div className="flex gap-4 text-sm">
                <Link href={`/persona/${item.id}`} className="text-indigo-600 underline">
                  View
                </Link>
                <Link href={`/persona/${item.id}/edit`} className="text-indigo-600 underline">
                  Edit Persona
                </Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 underline">
                  Delete
                </button>
              </div>
              <p className="text-xs text-foreground/60">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
