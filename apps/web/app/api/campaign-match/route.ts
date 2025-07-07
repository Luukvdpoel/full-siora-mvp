import creators from '@/app/data/mock_creators_200.json';

interface CampaignRequest {
  name?: string;
  niche?: string;
  platform?: string;
  tone?: string;
  budget?: string;
}

type Creator = (typeof creators)[number];

function scoreCreator(c: Creator, req: CampaignRequest) {
  let score = 0;
  const reasons: string[] = [];

  if (req.platform) {
    const match = c.platform.toLowerCase().includes(req.platform.toLowerCase());
    if (match) {
      score += 0.25;
      reasons.push('Platform match');
    }
  }

  if (req.tone) {
    const match = c.tone.toLowerCase().includes(req.tone.toLowerCase());
    if (match) {
      score += 0.25;
      reasons.push('Tone match');
    }
  }

  if (req.niche) {
    const norm = req.niche.toLowerCase();
    const match =
      c.niche.toLowerCase().includes(norm) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(norm));
    if (match) {
      score += 0.25;
      reasons.push('Niche match');
    }
  }

  if (req.budget) {
    const num = parseInt(req.budget.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      const maxFollowers = num * 100; // rough $10 CPM assumption
      if (c.followers <= maxFollowers) {
        score += 0.25;
        reasons.push('Within budget');
      }
    }
  }

  return { score, reasons };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CampaignRequest;

    const scored = creators.map((c) => {
      const { score, reasons } = scoreCreator(c, body);
      return { persona: c, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({ results: scored.slice(0, 5) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('campaign match error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
