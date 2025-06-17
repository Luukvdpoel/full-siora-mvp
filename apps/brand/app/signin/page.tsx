"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useBrandUser } from "@/lib/brandUser";

export default function SignInPage() {
  const { setUser } = useBrandUser();
  const [email, setEmail] = useState("");

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/select-role" });
  };

  const handleTemp = () => {
    if (email) setUser({ email });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <button
        onClick={handleGoogle}
        className="bg-Siora-accent text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
      <div className="flex items-center gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Temp email"
          className="p-2 rounded border"
        />
        <button
          onClick={handleTemp}
          className="bg-Siora-accent text-white px-3 py-1 rounded"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
