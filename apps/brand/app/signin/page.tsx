"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SignInPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email);
    router.push("/brands");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handle} className="space-y-4 bg-Siora-mid p-6 rounded-xl">
        <h1 className="text-xl font-bold text-white">Brand Sign In</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-Siora-accent text-white px-4 py-2 rounded w-full"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
