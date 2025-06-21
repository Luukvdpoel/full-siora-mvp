"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import { ChatPanel, ChatMessage } from "shared-ui";
import mockMessages, { StoredMessage } from "@/app/data/mock_messages";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

export default function CampaignChatPage({ params }: { params: { creatorId: string; id: string } }) {
  const creator = creators.find((c) => c.id === params.creatorId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = (mockMessages[params.creatorId] ?? []) as StoredMessage[];
    const mapped = stored.map((m, i) => ({
      id: `${params.creatorId}-${i}`,
      creatorId: params.creatorId,
      sender: m.sender,
      text: m.content,
      timestamp: m.timestamp,
      campaign: params.id,
    }));
    setMessages(mapped);
  }, [params.creatorId, params.id]);

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
        <h1 className="text-2xl font-bold">Chat with {creator?.name ?? params.creatorId}</h1>
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
