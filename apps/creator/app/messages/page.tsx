"use client";
import Link from "next/link";
import brands from "@/app/data/mock_brands.json";

export default function MessagesPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <ul className="space-y-2">
          {brands.map((b) => (
            <li key={b.id}>
              <Link href={`/messages/${b.id}`} className="text-Siora-accent underline">
                Chat with {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
