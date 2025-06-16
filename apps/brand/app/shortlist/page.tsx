"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import CreatorCard from "@/components/CreatorCard";
import { useSession } from "next-auth/react";
import { useShortlist } from "@/lib/shortlist";

export default function ShortlistPage() {
  const { data: session, status } = useSession();
  const user = session?.user?.email ?? null;
  const router = useRouter();
  const { ids, toggle } = useShortlist(user);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  if (status === "loading") return null;

  const saved = creators.filter((c) => ids.includes(c.id));

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight">My Shortlist</h1>
        {saved.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">No creators saved.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((c) => (
              <CreatorCard key={c.id} creator={c} onShortlist={toggle} shortlisted={true} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
