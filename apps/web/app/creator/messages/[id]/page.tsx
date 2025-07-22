"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import brands from "@/app/creator/data/mock_brands.json";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const brand = brands.find((b) => b.id === params.id);
  const creatorId = "1"; // demo user
  const brandId = "brand1"; // temporary until auth wiring
  const [messages, setMessages] = useState<Message[]>([]);
  const [campaign, setCampaign] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/messages?brandId=${brandId}&creatorId=${creatorId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages)) {
            const mapped = data.messages.map((m: any, i: number) => ({
              id: `${brandId}-${creatorId}-${i}`,
              creatorId,
              sender: m.senderId === brandId ? "brand" : "creator",
              text: m.message,
              timestamp: m.timestamp,
            }));
            setMessages(mapped);
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
  }, [brandId, creatorId]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `local-${Date.now()}`,
        creatorId,
        sender: 'creator',
        text,
        timestamp: new Date().toISOString(),
        campaign,
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Chat with {brand?.name ?? 'Brand'}</h1>
        <input
          className="p-2 border border-Siora-border rounded text-black"
          placeholder="Campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        />
        <ChatPanel
          messages={messages}
          currentUser="creator"
          onSend={send}
          sending={sending}
        />
        <Link
          href={`/creator/feedback/${brandId}`}
          className="mt-4 px-3 py-1 text-sm rounded bg-gray-700 text-white self-start"
        >
          Leave/View Feedback
        </Link>
      </div>
    </main>
  );
}
