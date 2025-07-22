"use client";
import React from 'react';
import { generateInstagramAuthUrl } from "@/lib/instagram";

export default function InstagramLogin() {
  const handleLogin = () => {
    window.location.href = generateInstagramAuthUrl();
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-Siora-accent text-white px-4 py-2 rounded"
      >
        Login with Instagram
      </button>
    </main>
  );
}
