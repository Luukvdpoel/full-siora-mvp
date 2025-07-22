"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { ChatPanel, ChatMessage } from "shared-ui";
import { creators } from "../../../web/app/data/creators";

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  pitch?: string;
  personaSummary?: string;
  status: string;
  timestamp: string;
}

interface CreatorInfo {
  id: string;
  name: string;
}

const brandId = "brand1"; // placeholder for auth

export default function InboxPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<{ creatorId: string; campaignId: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/applications`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setApps(data as Application[]);
        }
      } catch (err) {
        console.error("failed to load applications", err);
      }
    }
    load();
  }, []);

  async function openChat(creatorId: string, campaignId: string) {
    setSelected({ creatorId, campaignId });
    try {
      const res = await fetch(
        `/api/messages?brandId=${brandId}&creatorId=${creatorId}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          const mapped = data.messages.map((m: any, i: number) => ({
            id: `${brandId}-${creatorId}-${i}`,
            sender: m.senderId === brandId ? "brand" : "creator",
            text: m.message,
            timestamp: m.timestamp,
            read: m.read,
          }));
          setMessages(mapped);
        }
      }
    } catch (err) {
      console.error("failed to load messages", err);
    }
  }

  const send = async (text: string) => {
    if (!selected) return;
    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: "brand",
      text,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    try {
      await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          creatorId: selected.creatorId,
          senderId: brandId,
          receiverId: selected.creatorId,
          message: text,
        }),
      });
    } catch (err) {
      console.error("failed to send", err);
    }
  };

  const filtered = apps.filter(
    (a) => !filter || a.campaignId === filter
  );

  const uniqueCreators = filtered.map((a) => ({
    creatorId: a.userId,
    campaignId: a.campaignId,
    status: a.status,
  }));

  function getCreatorInfo(id: string): CreatorInfo | undefined {
    return (creators as any[]).find((c) => c.id === id) as CreatorInfo | undefined;
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inbox</h1>
      <input
        placeholder="Filter by campaign"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded bg-Siora-light text-white border border-Siora-border"
      />
      <div className="flex gap-6">
        <aside className="w-64 space-y-2">
          {uniqueCreators.map((c) => {
            const info = getCreatorInfo(c.creatorId);
            return (
              <button
                key={`${c.creatorId}-${c.campaignId}`}
                onClick={() => openChat(c.creatorId, c.campaignId)}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  selected?.creatorId === c.creatorId && selected.campaignId === c.campaignId
                    ? "bg-Siora-accent"
                    : "bg-Siora-light"
                }`}
              >
                {info ? info.name : c.creatorId} - {c.status}
              </button>
            );
          })}
        </aside>
        <section className="flex-1">
          {selected ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Chat with {getCreatorInfo(selected.creatorId)?.name ?? selected.creatorId}
              </h2>
              <ChatPanel
                messages={messages}
                currentUser="brand"
                onSend={send}
              />
            </>
          ) : (
            <p className="text-zinc-300">Select a creator to view messages.</p>
          )}
        </section>
      </div>
    </main>
  );
}

