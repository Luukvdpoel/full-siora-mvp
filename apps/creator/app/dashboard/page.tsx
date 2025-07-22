"use client";
import React from 'react';
import { useState } from "react";

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [link, setLink] = useState("");

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    const separator = url.includes("?") ? "&" : "?";
    const withUtm = `${url}${separator}utm_source=siora&utm_medium=affiliate`;
    const short = `https://siora.io/r?url=${encodeURIComponent(withUtm)}`;
    setLink(short);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Affiliate Link Generator</h1>
      <p className="text-foreground/80">
        Siora connects you with brands who value your influence—not just the sales you drive.
      </p>
      <form onSubmit={generate} className="space-y-4 border border-white/10 p-4 rounded-md">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Brand product URL"
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Generate Affiliate Link
        </button>
      </form>
      {link && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input value={link} readOnly className="w-full p-2 rounded-md bg-zinc-800 text-white" />
            <button
              onClick={copy}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-3 py-1 rounded-md"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-foreground/60">Analytics tracking coming soon.</p>
        </div>
      )}
      <p>
        <a href="/persona" className="text-indigo-600 underline">
          Go to Persona Generator
        </a>
      </p>
    </main>
  );
}
