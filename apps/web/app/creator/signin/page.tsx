import React from 'react';
"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/select-role" });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <button
        onClick={handleGoogle}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </main>
  );
}
