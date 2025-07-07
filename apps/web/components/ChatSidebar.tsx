"use client";
import { useEffect, useState } from "react";
import type { Creator } from "@/app/data/creators";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

interface Props {
  creator: Creator | null;
  onClose: () => void;
}

export default function ChatSidebar({ creator, onClose }: Props) {
  const brandId = "brand1"; // demo brand id until auth
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!creator) return;
    async function load() {
      try {
        const res = await fetch(
          `/api/messages?brandId=${brandId}&creatorId=${creator.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages)) {
            const sorted = data.messages
              .map((m: any, i: number) => ({
                id: `${brandId}-${creator.id}-${i}`,
                creatorId: creator.id,
                sender: m.senderId === brandId ? "brand" : "creator",
                text: m.message,
                timestamp: m.timestamp,
              }))
              .sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              );
            setMessages(sorted);
          }
        }
      } catch (err) {
        console.error("failed to load messages", err);
      }
    }
    load();
    // simple polling until real-time WebSocket integration is added
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [creator]);

  const send = async (text: string) => {
    if (!creator) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `local-${Date.now()}`,
        creatorId: creator.id,
        sender: 'brand',
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setSending(false);
    }
  };

  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full max-w-md bg-Siora-mid border-l border-Siora-border p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Chat with {creator.name}</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        <ChatPanel
          messages={messages}
          currentUser="brand"
          onSend={send}
          sending={sending}
        />
      </div>
    </div>
  );
}
