"use client";
import { useEffect, useState } from "react";
import creators from "@/app/data/mock_creators_200.json";
import mockMessages, { StoredMessage } from "@/app/data/mock_messages";
import { ChatPanel, ChatMessage } from "shared-ui";

type Message = ChatMessage & { creatorId: string; campaign?: string };

export default function ChatPage({
  params,
}: {
  params: { creatorId: string };
}) {
  const creator = creators.find((c) => c.id === params.creatorId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [campaign, setCampaign] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = (mockMessages[params.creatorId] ?? []) as StoredMessage[];
    const mapped = stored.map((m, i) => ({
      id: `${params.creatorId}-${i}`,
      creatorId: params.creatorId,
      sender: m.sender,
      text: m.content,
      timestamp: m.timestamp,
    }));
    setMessages(mapped);
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
          className="p-2 border border-Siora-border rounded text-black"
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
