"use client";
import Link from "next/link";
import brands from "@/app/creator/data/mock_brands.json";
import mockMessages, { StoredMessage } from "@/app/creator/data/mock_messages";

interface Conversation {
  id: string;
  name: string;
  last?: StoredMessage;
}

export default function MessagesPage() {
  const conversations: Conversation[] = brands.map((b) => {
    const msgs = (mockMessages[b.id] ?? []) as StoredMessage[];
    const last = msgs[msgs.length - 1];
    return { id: b.id, name: b.name, last };
  });

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <ul className="space-y-2">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className="block bg-siora-mid border border-siora-border rounded-xl p-4 hover:bg-siora-light"
              >
                <div className="font-semibold mb-1">{c.name}</div>
                {c.last ? (
                  <div className="text-sm text-zinc-400 flex justify-between">
                    <span className="truncate mr-2">{c.last.content}</span>
                    <span className="whitespace-nowrap">
                      {new Date(c.last.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-zinc-400">No messages yet</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
