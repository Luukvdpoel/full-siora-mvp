"use client";

import { useState } from "react";

export default function LeadMagnetPage() {
  const [resourceType, setResourceType] = useState("");
  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Generation logic will be implemented later
    console.log({ resourceType, audience, problem });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Lead Magnet Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label className="block text-sm font-semibold mb-1">What type of resource do you want to offer?</label>
          <input
            type="text"
            placeholder="e.g. checklist, template, guide"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Who is it for?</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">What problem does it solve?</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
        >
          Generate My Lead Magnet
        </button>
      </form>
    </main>
  );
}
