"use client";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  creator: string | null;
};

export default function CollabRequestModal({ open, onClose, creator }: Props) {
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");

  if (!open) return null;

  const handleSend = () => {
    // In a real app this would POST to an API.
    console.log({ creator, message, budget });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-siora-mid border border-siora-border rounded-xl p-6 w-96 space-y-4 shadow-siora-hover">
        <h2 className="text-xl font-semibold">
          Request Collaboration with {creator}
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Short message"
          className="w-full h-24 p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
        />
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget range (e.g. $500-$1000)"
          className="w-full p-2 rounded-lg bg-siora-light text-white placeholder-zinc-400 border border-siora-border focus:outline-none focus:ring-2 focus:ring-siora-accent"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded border border-siora-border text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-1 text-sm rounded bg-siora-accent text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
