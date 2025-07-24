import React from 'react';
import Link from 'next/link';

export default function CreatorInfoPage() {
  return (
    <main className="min-h-screen px-6 py-10 space-y-8 text-center">
      <h1 className="text-4xl font-bold">Creator Tools</h1>
      <p className="text-zinc-300 max-w-2xl mx-auto">
        Explore persona generation, performance insights and campaign tools.
      </p>
      <ul className="space-y-2 max-w-md mx-auto text-left list-disc list-inside">
        <li>Generate AI personas</li>
        <li>Manage campaigns and applications</li>
        <li>Track performance metrics</li>
        <li>Connect with brands</li>
      </ul>
      <div className="flex justify-center gap-4">
        <Link href="/signup?role=creator" className="px-6 py-3 rounded-md bg-Siora-accent hover:bg-Siora-hover">
          Join as Creator
        </Link>
        <Link href="/creator/dashboard" className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-Siora-dark">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
