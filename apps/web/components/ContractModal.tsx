"use client";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  creatorName: string;
}

export default function ContractModal({ open, onClose, creatorName }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [payment, setPayment] = useState("");
  const [contract, setContract] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const generate = async () => {
    setLoading(true);
    setContract(null);
    try {
      const res = await fetch("/api/contract/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: "Demo Brand",
          creatorName,
          deliverables,
          payment,
          startDate,
          endDate,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setContract(data.contract);
      } else {
        alert("Failed to generate contract");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-siora-mid border border-siora-border rounded-xl p-6 w-96 space-y-4 shadow-siora-hover">
        <h2 className="text-xl font-semibold">Generate Contract</h2>
        {!contract && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-siora-light text-white border border-siora-border"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-siora-light text-white border border-siora-border"
              placeholder="End Date"
            />
            <input
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="Deliverables"
              className="w-full p-2 rounded-lg bg-siora-light text-white border border-siora-border"
            />
            <input
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="Payment Terms"
              className="w-full p-2 rounded-lg bg-siora-light text-white border border-siora-border"
            />
          </>
        )}
        {contract && (
          <>
            <textarea
              readOnly
              value={contract}
              className="w-full h-40 p-2 rounded-lg bg-siora-light text-white border border-siora-border overflow-y-auto"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={async () => contract && (await navigator.clipboard.writeText(contract))}
                className="px-3 py-1 text-sm rounded bg-siora-accent text-white"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => alert('Export to PDF coming soon')}
                className="px-3 py-1 text-sm rounded bg-siora-accent text-white"
              >
                Export PDF
              </button>
            </div>
          </>
        )}
        {!contract && (
          <button
            onClick={generate}
            disabled={loading}
            className="w-full px-3 py-1 text-sm rounded bg-siora-accent text-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full px-3 py-1 text-sm rounded border border-siora-border text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
