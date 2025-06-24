import creators from '@/app/data/mock_creators_200.json';
import Fuse from 'fuse.js';

interface RequestBody {
  intent: string;
  tone?: string;
}

type Persona = (typeof creators)[number];

type FuseResult = { item: Persona; score?: number };

export async function POST(req: Request) {
  try {
    const { intent, tone } = (await req.json()) as RequestBody;
    const fuse = new Fuse(creators, {
      keys: ['summary', 'niche', 'tags'],
      threshold: 0.4,
      includeScore: true,
    });

    const audResults: FuseResult[] = intent
      ? fuse.search(intent.toLowerCase())
      : creators.map((c) => ({ item: c, score: 1 }));

    const scored = audResults.map(({ item, score }) => {
      const audienceScore = 1 - (score ?? 1);
      const toneScore = tone
        ? item.tone.toLowerCase().includes(tone.toLowerCase())
          ? 1
          : 0
        : 0;
      const final = audienceScore * 0.7 + toneScore * 0.3;
      return { item, score: final };
    });

    scored.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({ results: scored.map((s) => s.item).slice(0, 20) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('intent search error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
