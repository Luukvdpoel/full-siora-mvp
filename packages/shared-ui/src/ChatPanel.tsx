import React from 'react';
"use client";

import React, { useState, useRef, useEffect } from 'react';

export type ChatMessage = {
  id: string;
  sender: 'brand' | 'creator';
  text: string;
  timestamp: string;
  campaign?: string;
  read?: boolean;
};

export interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void> | void;
  sending?: boolean;
  currentUser: 'brand' | 'creator';
}

export function ChatPanel({ messages, onSend, sending, currentUser }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await onSend(input);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto border border-Siora-border rounded-xl p-4 bg-Siora-mid text-white mb-2 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div>
              <div className="text-xs text-zinc-400 mb-1">
                {new Date(m.timestamp).toLocaleString()}
              </div>
              <div
                className={`inline-block px-4 py-2 rounded-2xl border border-Siora-border ${m.sender === currentUser ? 'bg-Siora-accent' : 'bg-gray-700'}`}
              >
                {m.text}
                {m.sender === currentUser && (
                  <span className="ml-2 text-xs">
                    {m.read ? '✓' : '•'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <textarea
          rows={3}
          className="flex-1 p-2 rounded-lg bg-Siora-light text-white placeholder-zinc-400 border border-Siora-border resize-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 bg-Siora-accent text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
