import creators from '@/app/data/mock_creators_200.json';
import Fuse from 'fuse.js';

type Persona = (typeof creators)[number];

// Helper to compute cosine similarity
type Vector = number[];
function cosineSim(a: Vector, b: Vector) {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB || 1);
}

async function embed(text: string): Promise<Vector> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}`);
  }

  const data = await res.json();
  return data.data[0].embedding as number[];
}

export async function POST(req: Request) {
  try {
    const { values, tone, audience } = await req.json();
    const query = `${values ?? ''} ${tone ?? ''} ${audience ?? ''}`.trim();

    let results: Persona[] = [];

    if (process.env.OPENAI_API_KEY) {
      try {
        const qEmbed = await embed(query);
        const embeds = await Promise.all(
          creators.map((c) => embed(`${c.summary} ${c.tone} ${c.tags?.join(' ')}`))
        );
        const scored = creators.map((c, i) => ({ c, score: cosineSim(qEmbed, embeds[i]) }));
        scored.sort((a, b) => b.score - a.score);
        results = scored.slice(0, 20).map((s) => s.c);
      } catch (err) {
        console.error('Embedding search failed', err);
      }
    }

    if (results.length === 0) {
      const fuse = new Fuse(creators, {
        keys: ['summary', 'tone', 'tags', 'platform', 'niche'],
        threshold: 0.4,
      });
      results = fuse.search(query).map((r) => r.item);
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
