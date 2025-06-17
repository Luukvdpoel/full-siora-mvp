import creators from "@/app/data/mock_creators_200.json";
import { notFound } from "next/navigation";
import PerformanceTab from "@/components/PerformanceTab";

type Props = {
  params: {
    id: string;
  };
};

export default function CreatorProfile({ params }: Props) {
  const creator = creators.find((c) => c.id.toString() === params.id);
  if (!creator) return notFound();

  return (
    <main className="min-h-screen bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border border-Siora-border rounded-2xl bg-Siora-mid p-6 shadow-Siora-hover">
          <h1 className="text-3xl font-bold tracking-tight">
            {creator.name}{" "}
            <span className="text-Siora-accent">
              {creator.handle.startsWith("@") ? creator.handle : `@${creator.handle}`}
            </span>
          </h1>

          <p className="text-zinc-400 text-sm mt-1">
            {creator.niche} • {creator.platform}
          </p>

          <p className="mt-4 text-zinc-300 leading-relaxed">{creator.summary}</p>

          <div className="mt-6 space-y-2 text-sm text-zinc-300">
            <div>
              <strong>Followers:</strong> {creator.followers.toLocaleString()}
            </div>
            <div>
              <strong>Engagement Rate:</strong> {creator.engagementRate}%
            </div>
            <div>
              <strong>Tone:</strong> {creator.tone}
            </div>
          </div>

          {creator.tags && (
            <div className="mt-6">
              <h2 className="text-md font-semibold mb-2">Tags & Values</h2>
              <div className="flex flex-wrap gap-2">
                {creator.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-Siora-light text-white border border-Siora-border px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <PerformanceTab creatorId={creator.id.toString()} />
        </div>
      </div>
    </main>
  );
}



