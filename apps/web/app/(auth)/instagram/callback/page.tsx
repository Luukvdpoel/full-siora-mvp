'use client';
import React from 'react';
import { useEffect } from "react";

export default function InstagramCallback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      fetch("/api/instagram/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle Instagram profile data
        })
        .catch((err) => console.error("Instagram auth failed", err));
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Authenticating...</p>
    </main>
  );
}
