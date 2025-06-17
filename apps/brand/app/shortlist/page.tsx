"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import creators from "@/app/data/mock_creators_200.json";
import CreatorCard from "@/components/CreatorCard";
import { useBrandUser } from "@/lib/brandUser";
import { useShortlist } from "@/lib/shortlist";
import Link from "next/link";
import { useCreatorMeta } from "@/lib/creatorMeta";

export default function ShortlistPage() {
  const { user } = useBrandUser();
  const router = useRouter();
  const { ids, toggle } = useShortlist(user?.email ?? null);
  const { status: collabStatus } = useCreatorMeta(user?.email ?? null);

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  if (!user) return null;

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
              <CreatorCard key={c.id} creator={c} onShortlist={toggle} shortlisted={true}>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <Link href={`/creator/${c.id}/profile`} className="text-Siora-accent underline">Profile</Link>
                  <Link href={`/creator/${c.id}/notes`} className="text-Siora-accent underline">Notes</Link>
                  <span className="text-zinc-400 ml-auto">Status: {collabStatus[c.id] ?? "not_contacted"}</span>
                </div>
              </CreatorCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
