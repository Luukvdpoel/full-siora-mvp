"use client";
import { useEffect, useState } from "react";
import brands from "@/app/data/mock_brands.json";
import mockMessages, { StoredMessage } from "@/app/data/mock_messages";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const brand = brands.find((b) => b.id === params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [campaign, setCampaign] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = (mockMessages[params.id] ?? []) as StoredMessage[];
    const mapped = stored.map((m, i) => ({
      id: `${params.id}-${i}`,
      creatorId: params.id,
      sender: m.sender,
      text: m.content,
      timestamp: m.timestamp,
    }));
    setMessages(mapped);
  }, [params.id]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `local-${Date.now()}`,
        creatorId: params.id,
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
      </div>
    </main>
  );
}
