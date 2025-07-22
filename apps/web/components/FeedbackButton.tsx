'use client';
import React, { useState } from 'react';

export default function FeedbackButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  async function send() {
    try {
      await fetch('/api/fairness/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: id, feedback: text }),
      });
      setSent(true);
      setText('');
    } catch (err) {
      console.error('feedback error', err);
    }
  }

  if (sent) {
    return (
      <button className="text-sm underline" onClick={() => setSent(false)}>
        Feedback sent
      </button>
    );
  }

  return open ? (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-1 rounded bg-Siora-light text-white border border-Siora-border"
        placeholder="Your feedback"
      />
      <button onClick={send} className="px-2 py-1 text-sm rounded bg-Siora-accent text-white">
        Send
      </button>
      <button onClick={() => setOpen(false)} className="text-sm underline">
        Cancel
      </button>
    </div>
  ) : (
    <button onClick={() => setOpen(true)} className="text-sm underline text-Siora-accent">
      Leave Feedback
    </button>
  );
}
