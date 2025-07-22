"use client";
import React from 'react';
import { useState } from "react";
import { useToast } from "@creator/components/Toast";

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const toast = useToast();
  const checkout = async (plan: string) => {
    setLoading(plan);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      setLoading(null);
      toast("Error creating checkout");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-background text-foreground">
      <button
        onClick={() => checkout("starter")}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        disabled={loading!==null}
      >
        {loading === "starter" ? "Redirecting..." : "Subscribe Starter"}
      </button>
      <button
        onClick={() => checkout("pro")}
        className="bg-purple-600 text-white px-4 py-2 rounded-md"
        disabled={loading!==null}
      >
        {loading === "pro" ? "Redirecting..." : "Subscribe Pro"}
      </button>
    </main>
  );
}
