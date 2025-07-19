import { creators } from "@/app/data/creators";
import { notFound } from "next/navigation";
import PerformanceTab from "@/components/PerformanceTab";
import CreatorMetrics from "@/components/CreatorMetrics";
import { Suspense } from "react";
import { Spinner } from "shared-ui";

type Props = {
  params: {
    id: string;
  };
};

export default function CreatorProfile({ params }: Props) {
  const creator = creators.find((c) => c.id === params.id);

  if (!creator) return notFound();

  return (
    <main className="min-h-screen bg-gradient-radial from-siora-dark via-siora-mid to-siora-light text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          {creator.name}{" "}
          <span className="text-siora-accent">@{creator.handle}</span>
        </h1>

        <p className="text-zinc-400 text-sm">
          {creator.niche} • {creator.platform}
        </p>

        <p className="text-base text-zinc-300">{creator.summary}</p>

        <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
          <span>{creator.followers.toLocaleString()} followers</span>
          <span>•</span>
          <span>{creator.engagementRate}% engagement rate</span>
        </div>

        {creator.tags?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {creator.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-siora-light text-xs px-3 py-1 rounded-full text-white border border-siora-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {creator.tone && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tone</h2>
            <p className="text-zinc-300">{creator.tone}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Performance</h2>
          <Suspense fallback={<Spinner />}>
            <CreatorMetrics creatorId={creator.id} />
          </Suspense>
          <Suspense fallback={<Spinner />}>
            <PerformanceTab creatorId={creator.id} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
