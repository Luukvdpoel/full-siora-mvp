"use client";
import { useEffect, useState, useRef } from "react";
import creators from "@/app/data/mock_creators_200.json";
import { useAuth } from "@/lib/auth";

type Message = {
  id: string;
  creatorId: string;
  sender: 'brand' | 'creator';
  text: string;
  timestamp: string;
};

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const creator = creators.find((c) => c.id === params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/messages?creatorId=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
          setTimeout(() => bottomRef.current?.scrollIntoView(), 0);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [params.id]);

  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: params.id, sender: 'brand', text: input }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setInput('');
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Chat with {creator?.name ?? 'Creator'}</h1>
        <div className="border border-Siora-border rounded-lg p-4 bg-Siora-mid text-white h-96 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`mb-3 ${m.sender === 'brand' ? 'text-right' : 'text-left'}`}>\
              <div className="text-xs text-zinc-400 mb-1">
                {m.sender === 'brand' ? (user ?? 'Brand') : creator?.name ?? 'Creator'}
              </div>
              <div className={`inline-block px-3 py-1 rounded ${m.sender === 'brand' ? 'bg-Siora-accent' : 'bg-gray-700'}`}>{m.text}</div>
            </div>
          ))}
          {input && <div className="text-xs text-zinc-400">{user ?? 'Brand'} typing...</div>}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded border border-Siora-border text-black"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={send}
            disabled={sending}
            className="px-4 py-2 bg-Siora-accent text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
