"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { useToast } from "@creator/components/Toast";
import ReactMarkdown from "react-markdown";

export default function CreatorProfilePage() {
  const [persona, setPersona] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("personaResult");
    if (stored) setPersona(stored);
  }, []);

  const handleCopy = () => {
    if (!persona) return;
    navigator.clipboard.writeText(persona);
    toast("Persona copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([persona], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siora-persona.md";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Creator Profile</h1>
      {persona ? (
        <div className="space-y-4">
          <div className="prose prose-invert max-w-none border border-white/10 p-4 rounded-md">
            <ReactMarkdown>{persona}</ReactMarkdown>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Download
            </button>
          </div>
        </div>
      ) : (
        <p>No persona found.</p>
      )}
    </main>
  );
}
