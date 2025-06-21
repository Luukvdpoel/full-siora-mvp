"use client";
import { useEffect, useState } from "react";
import type { Creator } from "@/app/data/creators";
import { ChatPanel, ChatMessage } from "shared-ui";
import mockMessages, { StoredMessage } from "@/app/data/mock_messages";

interface Message extends ChatMessage {
  creatorId: string;
  campaign?: string;
}

interface Props {
  creator: Creator | null;
  onClose: () => void;
}

export default function ChatSidebar({ creator, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!creator) return;
    const stored = (mockMessages[creator.id] ?? []) as StoredMessage[];
    const sorted = stored
      .map((m, i) => ({
        id: `${creator.id}-${i}`,
        creatorId: creator.id,
        sender: m.sender,
        text: m.content,
        timestamp: m.timestamp,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    setMessages(sorted);
  }, [creator]);

  const send = async (text: string) => {
    if (!creator) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `local-${Date.now()}`,
        creatorId: creator.id,
        sender: 'brand',
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setSending(false);
    }
  };

  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full max-w-md bg-Siora-mid border-l border-Siora-border p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Chat with {creator.name}</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        <ChatPanel
          messages={messages}
          currentUser="brand"
          onSend={send}
          sending={sending}
        />
      </div>
    </div>
  );
}
