"use client";
import React from 'react';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "shared-ui";
import { useRouter } from "next/navigation";

interface SavedPersona {
  id: string;
  data: any;
}

export default function PersonaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [values, setValues] = useState("");
  const [tone, setTone] = useState("");
  const [experience, setExperience] = useState("");
  const [niche, setNiche] = useState("");
  const [persona, setPersona] = useState<string>("");
  const [personaId, setPersonaId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/persona")
        .then((res) => (res.ok ? res.json() : null))
        .then((data: SavedPersona | null) => {
          if (data && data.id) {
            setPersonaId(data.id);
            setPersona(typeof data.data === "string" ? data.data : data.data?.persona ?? "");
          }
        })
        .catch(() => {});
    }
  }, [status]);

  if (status === "loading") return null;
  if (!session) {
    router.replace("/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/persona/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, tone, experience, niche }),
      });
      const data = await res.json();
      if (res.ok) {
        setPersona(data.persona as string);
        setPersonaId(data.id as string);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!personaId) return;
    setLoading(true);
    try {
      await fetch(`/api/persona/${personaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      setEditMode(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Persona Generator</h1>
      {persona ? (
        <div className="space-y-4">
          {editMode ? (
            <textarea
              className="w-full p-2 rounded-md bg-zinc-800 text-white"
              rows={10}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
            />
          ) : (
            <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: persona }} />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 rounded bg-zinc-700 text-white"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                Save
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setPersona("");
                setPersonaId("");
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
           <input
              className="w-full p-2 rounded-md bg-zinc-800 text-white"
              placeholder="Your niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            />
          <input
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="Brand tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            required
          />
          <input
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="Experience level"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          <textarea
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            rows={3}
            placeholder="Core values"
            value={values}
            onChange={(e) => setValues(e.target.value)}
            required
          />
           <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
        </Card>
      )}
    </main>
  );
}
