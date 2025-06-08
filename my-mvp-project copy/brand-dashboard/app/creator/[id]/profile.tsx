import creators from "@/app/data/mock_creators_200.json";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function CreatorProfile({ params }: Props) {
  const creator = creators.find((c) => c.id.toString() === params.id);
  if (!creator) return notFound();

  return (
    <main className="min-h-screen bg-gradient-radial from-nura-dark via-nura-mid to-nura-light text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border border-nura-border rounded-2xl bg-nura-mid p-6 shadow-nura-hover">
          <h1 className="text-3xl font-bold tracking-tight">
            {creator.name}{" "}
            <span className="text-nura-accent">
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
                    className="text-xs bg-nura-light text-white border border-nura-border px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



