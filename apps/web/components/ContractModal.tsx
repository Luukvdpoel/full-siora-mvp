"use client";
import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  creatorName: string;
  dealPreference?: string;
}

export default function ContractModal({
  open,
  onClose,
  creatorName,
  dealPreference,
}: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [payment, setPayment] = useState("");
  const [contract, setContract] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dealType, setDealType] = useState("flat_fee");

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
          dealType,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Generate Contract
          </DialogTitle>
        </DialogHeader>
        {!contract && (
          <>
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
            <select
              value={dealType}
              onChange={(e) => setDealType(e.target.value)}
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            >
              <option value="flat_fee">Flat Fee</option>
              <option value="commission">Commission Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <input
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="Payment Terms"
              className="w-full p-2 rounded-lg bg-Siora-light text-white border border-Siora-border"
            />
            {dealType === "commission" && dealPreference && (
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                Creator dislikes affiliate-only deals
              </span>
            )}
          </>
        )}
        {contract && (
          <>
            <textarea
              readOnly
              value={contract}
              className="w-full h-40 p-2 rounded-lg bg-Siora-light text-white border border-Siora-border overflow-y-auto"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={async () =>
                  contract && (await navigator.clipboard.writeText(contract))
                }
                className="px-3 py-1 text-sm rounded bg-Siora-accent text-white"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => alert("Export to PDF coming soon")}
                className="px-3 py-1 text-sm rounded bg-Siora-accent text-white"
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
      </DialogContent>
    </Dialog>
  );
}
