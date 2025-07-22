"use client";
import React from 'react';
import { useSession } from "next-auth/react";

export default function ContactPage() {
  const { data } = useSession();
  const email = data?.user?.email ?? "creator@example.com";
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 space-y-4">
      <h1 className="text-2xl font-bold">Contact</h1>
      <p>
        Reach out via{' '}
        <a href={`mailto:${email}`} className="underline text-indigo-600">
          {email}
        </a>
      </p>
    </main>
  );
}
