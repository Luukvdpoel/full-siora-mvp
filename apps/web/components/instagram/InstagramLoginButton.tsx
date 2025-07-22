'use client';
import React from 'react';
import { generateInstagramAuthUrl } from "@/lib/instagram";

export default function InstagramLoginButton() {
  const handleLogin = () => {
    window.location.href = generateInstagramAuthUrl();
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-Siora-accent text-white px-4 py-2 rounded"
    >
      Login with Instagram
    </button>
  );
}
