"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBrandUser } from "@/lib/brandUser";
import Toast from "@/components/Toast";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useBrandUser();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/select-role" });
  };

  const handleTemp = () => {
    if (submitting) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    setUser({ email });
    setToast("Signed in!");
    router.push("/brands");
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <button
        onClick={handleGoogle}
        className="bg-siora-accent text-white px-4 py-2 rounded"
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
          className="bg-siora-accent text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={submitting}
        >
          Continue
        </button>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </main>
  );
}
