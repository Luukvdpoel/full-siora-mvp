"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/select-role" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleGoogle}
        className="bg-Siora-accent text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </main>
  );
}
