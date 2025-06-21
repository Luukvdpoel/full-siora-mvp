"use client";

import { useState } from "react";
import { ChatPanel, ChatMessage } from "shared-ui";
import creators from "@/app/data/mock_creators_200.json";

interface Creator {
  id: string;
  name: string;
}

const contacts: Creator[] = creators.slice(0, 5).map((c: any) => ({
  id: c.id,
  name: c.name,
}));

const mockThreads: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      sender: "creator",
      text: "Hey there! Thanks for reaching out.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m2",
      sender: "brand",
      text: "Excited to chat about a potential collab!",
      timestamp: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "m3",
      sender: "creator",
      text: "I'd love to hear more about your campaign.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m4",
      sender: "brand",
      text: "I'll send you the details shortly.",
      timestamp: new Date().toISOString(),
    },
  ],
};

export default function InboxPage() {
  const [selected, setSelected] = useState<Creator | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const openChat = (c: Creator) => {
    setSelected(c);
    setMessages(mockThreads[c.id] ?? []);
  };

  const send = async (text: string) => {
    if (!text.trim() || !selected) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "brand",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white">
      <div className="max-w-5xl mx-auto flex gap-6">
        <aside className="w-64 space-y-2">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => openChat(c)}
              className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                selected?.id === c.id ? "bg-Siora-accent" : "bg-Siora-light"
              }`}
            >
              {c.name}
            </button>
          ))}
        </aside>
        <section className="flex-1">
          {selected ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Chat with {selected.name}</h2>
              <ChatPanel messages={messages} currentUser="brand" onSend={send} />
            </>
          ) : (
            <p className="text-zinc-300">Select a creator to view messages.</p>
          )}
        </section>
      </div>
    </main>
  );
}

