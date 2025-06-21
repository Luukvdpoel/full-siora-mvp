"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import campaigns from "@/app/data/campaigns";
import mockMessages, { StoredMessage } from "@/app/data/mock_messages";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

const creatorId = "1"; // demo user

export default function CreatorCampaignChat() {
  const params = useParams<{ id: string }>();
  const campaign = campaigns.find((c) => c.id === params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    const stored = (mockMessages[creatorId] ?? []) as StoredMessage[];
    const mapped = stored.map((m, i) => ({
      id: `${creatorId}-${i}`,
      creatorId,
      sender: m.sender,
      text: m.content,
      timestamp: m.timestamp,
      campaign: params.id,
    }));
    setMessages(mapped);
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
