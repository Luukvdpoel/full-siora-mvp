import React from 'react';
import { creators } from '@/app/data/creators';
import { Badge } from 'shared-ui';
import { getCreatorBadges } from 'shared-utils';
import ReactMarkdown from 'react-markdown';

export default function CreatorPublicPage({ params }: { params: { handle: string } }) {
  const rawHandle = decodeURIComponent(params.handle);
  const normalized = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
  const creator = creators.find(c => c.handle.toLowerCase() === normalized.toLowerCase());

  if (!creator) {
    return <main className="p-6">Creator not found.</main>;
  }

  const badges = getCreatorBadges({
    verified: creator.verified,
    completedCollabs: creator.completedCollabs,
    avgResponseMinutes: creator.avgResponseMinutes,
  });

  const hooks = [
    `Authentic ${creator.niche} insights`,
    creator.vibe ? `Vibe: ${creator.vibe}` : `Tone: ${creator.tone}`,
    `Engaging ${creator.platform} content`,
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">
            {creator.name}{' '}
            <span className="text-indigo-600">{creator.handle}</span>
          </h1>
          <p className="text-gray-700">{creator.summary}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} label={b.label} />
            ))}
          </div>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Persona</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Niche: {creator.niche}</li>
            <li>Tone: {creator.tone}</li>
            {creator.vibe && <li>Vibe: {creator.vibe}</li>}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Hooks</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {hooks.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>

        {creator.markdown && (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Portfolio</h2>
            <ReactMarkdown className="prose max-w-none">{creator.markdown}</ReactMarkdown>
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Performance</h2>
          <p className="text-sm text-gray-700"><strong>Followers:</strong> {creator.followers.toLocaleString()}</p>
          <p className="text-sm text-gray-700"><strong>Engagement Rate:</strong> {creator.engagementRate}%</p>
        </section>

        <div>
          <a
            href={`mailto:collabs@usesiora.com?subject=Collab%20with%20${encodeURIComponent(creator.handle)}`}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full"
          >
            Pitch Me
          </a>
        </div>
      </div>
    </main>
  );
}
