"use client";
import { useEffect, useState } from "react";
import creators from "@/app/data/mock_creators_200.json";
import { ChatPanel, ChatMessage } from "shared-ui";

type Message = ChatMessage & { creatorId: string; campaign?: string };

export default function ChatPage({
  params,
}: {
  params: { creatorId: string };
}) {
  const creator = creators.find((c) => c.id === params.creatorId);
  const brandId = "brand1"; // demo brand id until auth
  const [messages, setMessages] = useState<Message[]>([]);
  const [campaign, setCampaign] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/messages?brandId=${brandId}&creatorId=${params.creatorId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages)) {
            const mapped = data.messages.map((m: any, i: number) => ({
              id: `${brandId}-${params.creatorId}-${i}`,
              creatorId: params.creatorId,
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
  }, [params.creatorId]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `local-${Date.now()}`,
        creatorId: params.creatorId,
        sender: 'brand',
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
        <h1 className="text-2xl font-bold">Chat with {creator?.name ?? 'Creator'}</h1>
        <input
          className="p-2 border border-siora-border rounded text-black"
          placeholder="Campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        />
        <ChatPanel
          messages={messages}
          currentUser="brand"
          onSend={send}
          sending={sending}
        />
      </div>
    </main>
  );
}
