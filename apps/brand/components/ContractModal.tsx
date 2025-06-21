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
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const generate = async () => {
    setLoading(true);
    setFileUrl(null);
    try {
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: "Demo Brand",
          creatorName,
          deliverables,
          startDate,
          endDate,
          paymentTerms: payment,
          format: "pdf",
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
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
      <div className="bg-Siora-mid border border-Siora-border rounded-xl p-6 w-96 space-y-4 shadow-Siora-hover">
        <h2 className="text-xl font-semibold">Generate Contract</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
          placeholder="End Date"
        />
        <input
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          placeholder="Deliverables"
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
        />
        <input
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          placeholder="Payment Terms"
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
        />
        {fileUrl ? (
          <a
            href={fileUrl}
            download="contract.pdf"
            className="block text-sm text-Siora-accent underline"
          >
            Download Contract
          </a>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            className="w-full px-3 py-1 text-sm rounded bg-Siora-accent text-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full px-3 py-1 text-sm rounded border border-Siora-border text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
