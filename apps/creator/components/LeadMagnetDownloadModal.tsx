"use client";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onDownload: (email: string) => void;
};

export default function LeadMagnetDownloadModal({ open, onClose, onDownload }: Props) {
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onDownload(email);
    setEmail("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background text-foreground border border-white/10 rounded-md p-6 w-80 space-y-4">
        <p className="text-center text-sm">
          Enter your email to download your personalized lead magnet
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md bg-zinc-800 text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm rounded border border-white/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1 text-sm rounded bg-indigo-600 text-white"
          >
            Download Now
          </button>
        </div>
      </div>
    </div>
  );
}
