"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="text-sm underline"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{session.user?.email}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="underline"
      >
        Sign Out
      </button>
    </div>
  );
}
