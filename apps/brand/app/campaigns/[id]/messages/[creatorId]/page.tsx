"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import { ChatPanel, ChatMessage } from "shared-ui";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

export default function CampaignChatPage({ params }: { params: { creatorId: string; id: string } }) {
  const creator = creators.find((c) => c.id === params.creatorId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/messages?creatorId=${params.creatorId}&campaign=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [params.creatorId, params.id]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: params.creatorId, sender: 'brand', text, campaign: params.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
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
