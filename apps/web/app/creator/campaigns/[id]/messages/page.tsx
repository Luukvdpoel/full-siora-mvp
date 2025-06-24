"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import campaigns from "@/app/creator/data/campaigns";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

const creatorId = "1"; // demo user
const brandId = "brand1"; // temporary until auth wiring

export default function CreatorCampaignChat() {
  const params = useParams<{ id: string }>();
  const campaign = campaigns.find((c) => c.id === params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!params.id) return;
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
              campaign: params.id,
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
  }, [params.id]);

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
        campaign: params.id,
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Chat about {campaign?.title ?? params.id}</h1>
        <ChatPanel
          messages={messages}
          currentUser="creator"
          onSend={send}
          sending={sending}
        />
      </div>
    </main>
  );
}
