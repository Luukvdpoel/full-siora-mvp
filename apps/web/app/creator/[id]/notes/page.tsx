'use client';
import React from 'react';
import { useEffect } from "react";
import { useBrandUser } from "@/lib/brandUser";
import { useRouter } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import { useCreatorMeta } from "@/lib/creatorMeta";

export default function CreatorNotesPage({ params }: { params: { id: string } }) {
  const { user } = useBrandUser();
  const router = useRouter();
  const { notes, updateNote, status: collab, updateStatus } = useCreatorMeta(user?.email ?? null);

  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [user, router]);

  if (!user) return null;

  const creator = creators.find((c) => c.id.toString() === params.id);
  if (!creator) return <p className="p-6">Creator not found</p>;

  const note = notes[creator.id] || "";
  const collabStatus = collab[creator.id] || "not_contacted";

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          Notes for {creator.name}{" "}
          <span className="text-Siora-accent">@{creator.handle.replace(/^@/, "")}</span>
        </h1>
        <textarea
          value={note}
          onChange={(e) => updateNote(creator.id, e.target.value)}
          placeholder="Add your notes"
          className="w-full h-40 p-3 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <div>
          <label className="block mb-1">Collab Status</label>
          <select
            value={collabStatus}
            onChange={(e) => updateStatus(creator.id, e.target.value as any)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          >
            <option value="not_contacted">Not contacted</option>
            <option value="contacted">Contacted</option>
            <option value="negotiating">Negotiating</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </main>
  );
}
