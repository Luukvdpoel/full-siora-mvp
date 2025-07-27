'use client';
import React from 'react';
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-Siora-dark text-white space-y-4 p-6">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <button
        onClick={() => reset()}
        className="bg-Siora-accent hover:bg-Siora-hover px-4 py-2 rounded-xl transition-all hover:scale-[1.02]"
      >
        Try again
      </button>
    </div>
  );
}
