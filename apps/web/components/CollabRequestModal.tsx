"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  creator: string | null;
};

export default function CollabRequestModal({ open, onClose, creator }: Props) {
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");

  const handleSend = () => {
    // In a real app this would POST to an API.
    console.log({ creator, message, budget });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Collaboration with {creator}</DialogTitle>
        </DialogHeader>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Short message"
          className="w-full h-24 p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget range (e.g. $500-$1000)"
          className="w-full p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border focus:outline-none focus:ring-2 focus:ring-Siora-accent"
        />
        <DialogFooter>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded border border-Siora-border text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-1 text-sm rounded bg-Siora-accent text-white"
          >
            Send
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
