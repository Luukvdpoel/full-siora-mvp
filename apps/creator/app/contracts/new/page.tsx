"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

export default function NewContractPage() {
  const [creatorHandle, setCreatorHandle] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [timeline, setTimeline] = useState("");
  const [payment, setPayment] = useState("");
  const [platform, setPlatform] = useState("");
  const [usageRights, setUsageRights] = useState("");
  const [contract, setContract] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setContract(null);
    try {
      const res = await fetch("/api/contract/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorHandle,
          deliverables,
          timeline,
          payment,
          platform,
          usageRights,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setContract(data.contract as string);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    const element = document.getElementById("contract-preview");
    if (!element || !contract) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save("contract.pdf"),
      html2canvas: { scale: 0.6 },
    });
  };

  const copy = async () => {
    if (!contract) return;
    try {
      await navigator.clipboard.writeText(contract);
    } catch (err) {
      console.error(err);
    }
  };

  const sendToBrand = () => {
    alert("Send to Brand coming soon");
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">New Contract</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label htmlFor="creatorHandle" className="block text-sm font-semibold mb-1">Creator handle</label>
          <input
            id="creatorHandle"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={creatorHandle}
            onChange={(e) => setCreatorHandle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="deliverables" className="block text-sm font-semibold mb-1">Deliverables</label>
          <input
            id="deliverables"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="3 Reels + 1 Story"
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-semibold mb-1">Timeline</label>
          <input
            id="timeline"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="payment" className="block text-sm font-semibold mb-1">Payment terms</label>
          <input
            id="payment"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="50% upfront, NET30"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-semibold mb-1">Platform(s)</label>
          <input
            id="platform"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="Instagram, TikTok"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="usageRights" className="block text-sm font-semibold mb-1">Usage rights</label>
          <input
            id="usageRights"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="90 days paid ads"
            value={usageRights}
            onChange={(e) => setUsageRights(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled={loading}>
          {loading ? "Generating..." : "Generate Contract"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {contract && (
        <div className="space-y-4 mt-6">
          <textarea
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            className="w-full h-40 p-2 rounded-md bg-zinc-800 text-white"
          />
          <div
            id="contract-preview"
            className="prose prose-invert max-w-none border border-white/10 p-4 rounded-md overflow-y-auto max-h-96"
          >
            <ReactMarkdown>{contract}</ReactMarkdown>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={downloadPdf}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-3 py-1 rounded"
            >
              Download as PDF
            </button>
            <button
              type="button"
              onClick={copy}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-3 py-1 rounded"
            >
              Copy to Clipboard
            </button>
            <button
              type="button"
              onClick={sendToBrand}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-3 py-1 rounded"
            >
              Send to Brand
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
