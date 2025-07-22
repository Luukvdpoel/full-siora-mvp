import React from 'react';
"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SelectRole() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) {
    router.replace("/signin");
    return null;
  }

  const choose = async (role: "creator" | "brand") => {
    await fetch("/api/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(role === "creator" ? "/creator/dashboard" : "/brand/dashboard");
  };

  const currentRole = (session.user as { role?: string }).role;
  if (currentRole) {
    router.replace(currentRole === "creator" ? "/creator/dashboard" : "/brand/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Are you a Creator or Brand?</h1>
      <div className="flex gap-4">
        <button onClick={() => choose("creator")} className="px-4 py-2 bg-blue-600 text-white rounded">
          Creator
        </button>
        <button onClick={() => choose("brand")} className="px-4 py-2 bg-green-600 text-white rounded">
          Brand
        </button>
      </div>
    </main>
  );
}
