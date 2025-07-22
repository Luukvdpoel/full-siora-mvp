"use client";
import { useEffect, useState } from "react";

export type CollabStatus = "new" | "contacted" | "interested" | "not_fit";

export function useCreatorMeta(user: string | null) {
  const notesKey = user ? `notes:${user}` : "notes";
  const statusKey = user ? `status:${user}` : "status";
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, CollabStatus>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedNotes = localStorage.getItem(notesKey);
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch {}
    try {
      const storedStatus = localStorage.getItem(statusKey);
      if (storedStatus) setStatus(JSON.parse(storedStatus));
    } catch {}
  }, [notesKey, statusKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(notesKey, JSON.stringify(notes));
  }, [notes, notesKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(statusKey, JSON.stringify(status));
  }, [status, statusKey]);

  const updateNote = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  const updateStatus = (id: string, s: CollabStatus) => {
    setStatus((prev) => ({ ...prev, [id]: s }));
  };

  return { notes, status, updateNote, updateStatus };
}
