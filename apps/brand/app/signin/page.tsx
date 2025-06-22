"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useBrandUser } from "@/lib/brandUser";
import { useToast } from "../../../../components/Toast";

export default function SignInPage() {
  const { setUser } = useBrandUser();
  const [email, setEmail] = useState("");
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/select-role" });
  };

  const handleTemp = () => {
    if (submitting) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email", "error");
      return;
    }
    setSubmitting(true);
    setUser({ email });
    showToast("Signed in!", "success");
    setTimeout(() => setSubmitting(false), 1000);
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
          className="bg-Siora-accent text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={submitting}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
