import React from 'react';
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-Siora-dark text-white space-y-4 p-6">
      <h2 className="text-2xl font-bold">Oops. Page not found.</h2>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-Siora-accent hover:bg-Siora-hover rounded-xl transition-all hover:scale-[1.02]"
      >
        ← Back to dashboard
      </a>
    </div>
  );
}
