'use client';
import React from 'react';
import { useEffect, useState } from "react";
import Link from "next/link";
import creators from "@/app/data/mock_creators_200.json";
import { ChatPanel, ChatMessage } from "shared-ui";

type Message = ChatMessage & {
  creatorId: string;
  campaign?: string;
  commissionOnly?: boolean;
};

export default function ChatPage({
  params,
}: {
  params: { creatorId: string };
}) {
  const creator = creators.find((c) => c.id === params.creatorId);
  const brandId = "brand1"; // demo brand id until auth
  const [messages, setMessages] = useState<Message[]>([]);
  const [campaign, setCampaign] = useState("");
  const [commissionOnly, setCommissionOnly] = useState(false);
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
        commissionOnly,
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={commissionOnly}
            onChange={(e) => setCommissionOnly(e.target.checked)}
          />
          Commission-only deal
        </label>
        {commissionOnly &&
          creator?.deal_preference &&
          /no affiliate-only|value-based/i.test(creator.deal_preference) && (
            <span className="text-red-600 text-sm">
              Creator prefers value-based deals
            </span>
          )}
        <ChatPanel
          messages={messages}
          currentUser="brand"
          onSend={send}
          sending={sending}
        />
        <Link
          href={`/feedback/${params.creatorId}`}
          className="mt-4 px-3 py-1 text-sm rounded bg-gray-700 text-white self-start"
        >
          Leave/View Feedback
        </Link>
      </div>
    </main>
  );
}
