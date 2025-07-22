'use client';
import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { Spinner } from "shared-ui";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Spinner />;
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
