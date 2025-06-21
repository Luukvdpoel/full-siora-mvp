"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

export default function LeadMagnetPage() {
  const [resourceType, setResourceType] = useState("");
  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setContent("");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone: problem || "Friendly",
          niche: audience,
          format: resourceType,
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setContent(text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    const element = document.getElementById("lead-magnet-preview");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save("lead-magnet.pdf"),
      html2canvas: { scale: 0.6 },
    });
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
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate My Lead Magnet"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {content && (
        <div className="space-y-4 mt-6">
          <div id="lead-magnet-preview" className="prose prose-invert max-w-none border border-white/10 p-4 rounded-md">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md"
          >
            Download PDF
          </button>
        </div>
      )}
    </main>
  );
}
