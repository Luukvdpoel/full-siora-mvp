import creators from '@/app/data/mock_creators_200.json';
import Fuse from 'fuse.js';

interface CampaignRequest {
  name?: string;
  focus?: string;
  platform?: string;
  tone?: string;
  audience?: string;
  budget?: string;
}

type Persona = (typeof creators)[number];

type FuseResult = { item: Persona; score?: number };

export async function POST(req: Request) {
  try {
    const { focus, platform, tone, audience } = (await req.json()) as CampaignRequest;

    const query = [focus, platform, tone, audience].filter(Boolean).join(' ');
    const fuse = new Fuse(creators, {
      keys: ['summary', 'niche', 'tags', 'platform', 'tone'],
      threshold: 0.4,
      includeScore: true,
    });

    const fuseResults: FuseResult[] = query
      ? fuse.search(query)
      : creators.map((c) => ({ item: c, score: 0 }));

    const results = fuseResults.map(({ item, score }) => {
      const reasons: string[] = [];
      const normPlatform = platform?.toLowerCase() || '';
      const normTone = tone?.toLowerCase() || '';
      const normFocus = focus?.toLowerCase() || '';

      if (platform && item.platform.toLowerCase().includes(normPlatform)) {
        reasons.push('Platform match');
      }
      if (tone && item.tone.toLowerCase().includes(normTone)) {
        reasons.push('Tone match');
      }
      if (
        focus &&
        (item.niche.toLowerCase().includes(normFocus) ||
          item.tags?.some((t) => t.toLowerCase().includes(normFocus)))
      ) {
        reasons.push('Content focus match');
      }

      const matchScore = 1 - (score ?? 1);
      return { persona: item, score: matchScore, reasons };
    });

    results.sort((a, b) => b.score - a.score);

    return new Response(JSON.stringify({ results: results.slice(0, 5) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('campaign match error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
