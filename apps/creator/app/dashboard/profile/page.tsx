"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

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
            <Button type="button" onClick={handleCopy}>Copy</Button>
            <Button type="button" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      ) : (
        <p>No persona found.</p>
      )}
    </main>
  );
}
