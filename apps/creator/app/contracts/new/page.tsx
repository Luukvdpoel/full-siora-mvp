"use client";

import { useState } from "react";

export default function NewContractPage() {
  const [brandName, setBrandName] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [dates, setDates] = useState("");
  const [compensation, setCompensation] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ brandName, deliverables, dates, compensation, paymentTerms, extraNotes });
    alert("Saved (not really)");
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">New Contract</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 p-4 rounded-md">
        <div>
          <label htmlFor="brandName" className="block text-sm font-semibold mb-1">Brand name</label>
          <input
            id="brandName"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
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
          />
        </div>
        <div>
          <label htmlFor="dates" className="block text-sm font-semibold mb-1">Campaign dates</label>
          <input
            id="dates"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="compensation" className="block text-sm font-semibold mb-1">Compensation</label>
          <input
            id="compensation"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="flat fee, gifted, rev share"
            value={compensation}
            onChange={(e) => setCompensation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-semibold mb-1">Payment terms</label>
          <input
            id="paymentTerms"
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            placeholder="50% upfront, NET30"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="extraNotes" className="block text-sm font-semibold mb-1">Extra notes or terms (optional)</label>
          <textarea
            id="extraNotes"
            rows={3}
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md">
          Save Contract
        </button>
      </form>
    </main>
  );
}
