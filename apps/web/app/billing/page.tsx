'use client';
import React from 'react';
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = async (plan: "pro" | "business") => {
    setLoading(plan);
    const res = await fetch("/api/billing/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      setLoading(null);
      alert("Error creating checkout session");
    }
  };

  const manage = async () => {
    setLoading("portal");
    const res = await fetch("/api/billing/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal: true }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      setLoading(null);
      alert("Error opening portal");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Billing</h1>
      <p>Current plan: {session?.user?.plan ?? "Free"}</p>
      <p>Status: {(session?.user as any)?.billingStatus ?? "none"}</p>
      <div className="flex gap-4">
        <button onClick={() => checkout("pro")} disabled={loading!==null} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {loading === "pro" ? "Redirecting..." : "Upgrade to Pro"}
        </button>
        <button onClick={() => checkout("business")} disabled={loading!==null} className="bg-purple-600 text-white px-4 py-2 rounded">
          {loading === "business" ? "Redirecting..." : "Upgrade to Business"}
        </button>
        <button onClick={manage} disabled={loading!==null} className="bg-gray-700 text-white px-4 py-2 rounded">
          {loading === "portal" ? "Loading..." : "Manage Billing"}
        </button>
      </div>
    </main>
  );
}
