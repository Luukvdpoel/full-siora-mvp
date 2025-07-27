'use client';
import React from 'react';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared-ui";

interface Props {
  open: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
}

export default function EvaluationChecklistModal({
  open,
  onClose,
  creatorId,
  creatorName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);


  const generate = async () => {
    setLoading(true);
    setMarkdown(null);
    try {
      const res = await fetch("/api/generate-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorName }),
      });
      if (res.ok) {
        const data = await res.json();
        setMarkdown(data.markdown);
      } else {
        alert("Failed to generate checklist");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!markdown) return;
    try {
      const raw = localStorage.getItem("savedChecklists") || "[]";
      const list = JSON.parse(raw) as any[];
      list.unshift({ creatorId, creatorName, markdown, timestamp: new Date().toISOString() });
      localStorage.setItem("savedChecklists", JSON.stringify(list));
      alert("Checklist saved");
    } catch (err) {
      console.error("save checklist", err);
    }
  };

  const exportPdf = async () => {
    if (!markdown) return;
    const res = await fetch("/api/generate-checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorName, format: "pdf" }),
    });
    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "checklist.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Evaluation Checklist for {creatorName}</DialogTitle>
        </DialogHeader>
        {markdown && (
          <pre className="whitespace-pre-wrap text-sm border border-Siora-border p-2 rounded bg-Siora-light text-white">
            {markdown}
          </pre>
        )}
        <div className="flex justify-end gap-2">
          {!markdown ? (
            <button onClick={generate} disabled={loading} className="px-3 py-1 text-sm rounded bg-Siora-accent text-white disabled:opacity-50">
              {loading ? "Generating..." : "Generate"}
            </button>
          ) : (
            <>
              <button onClick={save} className="px-3 py-1 text-sm rounded bg-Siora-accent text-white">
                Save for Later
              </button>
              <button onClick={exportPdf} className="px-3 py-1 text-sm rounded bg-Siora-accent text-white">
                Export as PDF
              </button>
            </>
          )}
          <button onClick={onClose} className="px-3 py-1 text-sm rounded border border-Siora-border text-white">
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
