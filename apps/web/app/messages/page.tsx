"use client";
import Link from "next/link";
import creators from "@/app/data/mock_creators_200.json";

export default function MessagesPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <ul className="space-y-2">
          {creators.slice(0, 10).map((c) => (
            <li key={c.id}>
              <Link href={`/messages/${c.id}`} className="text-Siora-accent underline">
                Chat with {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
