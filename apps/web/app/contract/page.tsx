'use client';
import React from 'react';

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

export default function ContractPage() {
  const [handle, setHandle] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [usage, setUsage] = useState("");
  const [payment, setPayment] = useState("");
  const [markdown, setMarkdown] = useState("");

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    const md = `## Creator Contract Summary\n\n- **Creator Handle**: ${handle}\n- **Deliverables**: ${deliverables}\n- **Budget**: ${budget}\n- **Deadline**: ${deadline}\n- **Usage Rights**: ${usage}\n- **Payment Terms**: ${payment}`;
    setMarkdown(md);
  };

  const download = (ext: "txt" | "md") => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract-summary.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const element = document.getElementById("contract-content");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save("contract-summary.pdf"),
      html2canvas: { scale: 0.6 },
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Contract Generator</h1>
        <form onSubmit={generate} className="space-y-4">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Creator Handle"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="Deliverables"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            placeholder="Usage Rights"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <input
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            placeholder="Payment Terms"
            className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
          />
          <button
            type="submit"
            className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-4 py-2 rounded-lg font-semibold w-full"
          >
            Generate Summary
          </button>
        </form>

        {markdown && (
          <div className="space-y-4">
            <div id="contract-content">
              <ReactMarkdown className="prose prose-invert max-w-none bg-Siora-mid p-4 rounded-lg">{markdown}</ReactMarkdown>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => download("txt")}
                className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
              >
                Export .txt
              </button>
              <button
                onClick={() => download("md")}
                className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
              >
                Export .md
              </button>
              <button
                onClick={downloadPdf}
                className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
              >
                Export .pdf
              </button>
              <button
                onClick={copy}
                className="bg-Siora-accent hover:bg-Siora-accent-soft text-white px-3 py-1 rounded"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
