"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("email", { email, redirect: false });
    if (res?.error) {
      setError(res.error);
    } else {
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      {sent ? (
        <p>Check your email for the login link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
          <h1 className="text-xl font-semibold text-center">Sign in</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full p-2 rounded-md border bg-background"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white py-2 rounded-md"
          >
            Send Magic Link
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      )}
    </main>
  );
}
