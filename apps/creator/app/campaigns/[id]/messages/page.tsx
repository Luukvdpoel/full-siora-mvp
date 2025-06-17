"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import campaigns from "@/app/data/campaigns";
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
    async function load() {
      try {
        const res = await fetch(`/api/messages?creatorId=${creatorId}&campaign=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (params.id) load();
  }, [params.id]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, sender: 'creator', text, campaign: params.id }),
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
