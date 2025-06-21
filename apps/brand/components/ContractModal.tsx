"use client";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  creator: string;
};

export default function ContractModal({ open, onClose, creator }: Props) {
  const [brand, setBrand] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  if (!open) return null;

  const generate = async () => {
    setLoading(true);
    setDownloadUrl(null);
    try {
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brand,
          creatorName: creator,
          deliverables,
          startDate: start,
          endDate: end,
          paymentTerms: payment,
          format: "pdf",
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        alert("Failed to generate contract");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-Siora-mid border border-Siora-border rounded-xl p-6 w-96 space-y-4 shadow-Siora-hover">
        <h2 className="text-xl font-semibold">Generate Contract for {creator}</h2>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand Name"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          placeholder="Deliverables"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          placeholder="Payment Terms"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (downloadUrl) URL.revokeObjectURL(downloadUrl);
              onClose();
            }}
            className="px-3 py-1 text-sm rounded border border-Siora-border text-white"
          >
            Cancel
          </button>
          <button
            onClick={generate}
            disabled={loading}
            className="px-3 py-1 text-sm rounded bg-Siora-accent text-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="contract.pdf"
            className="block text-center text-Siora-accent underline"
          >
            Download Contract
          </a>
        )}
      </div>
    </div>
  );
}
