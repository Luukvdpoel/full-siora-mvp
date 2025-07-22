import creators from '@/app/data/mock_creators_200.json';
import { NextResponse } from 'next/server';

interface GoalRequest {
  goals?: string;
  tone?: string;
  platform?: string;
  audience?: string;
}

function scoreCreator(c: (typeof creators)[number], req: GoalRequest) {
  let score = 0;
  const reasons: string[] = [];
  if (req.tone) {
    const match = c.tone?.toLowerCase().includes(req.tone.toLowerCase());
    if (match) {
      score += 25;
      reasons.push('Tone match');
    }
  }
  if (req.platform) {
    const match = c.platform.toLowerCase().includes(req.platform.toLowerCase());
    if (match) {
      score += 25;
      reasons.push('Platform match');
    }
  }
  if (req.goals) {
    const words = req.goals.toLowerCase().split(/[,\s]+/);
    const text = [c.niche, ...(c.tags||[])].join(' ').toLowerCase();
    const match = words.some(w => text.includes(w));
    if (match) {
      score += 25;
      reasons.push('Goal alignment');
    }
  }
  if (req.audience) {
    const words = req.audience.toLowerCase().split(/[,\s]+/);
    const text = c.summary.toLowerCase();
    const match = words.some(w => text.includes(w));
    if (match) {
      score += 25;
      reasons.push('Audience overlap');
    }
  }
  return { score, reasons };
}

export async function POST(req: Request) {
  try {
    const body: GoalRequest = await req.json();
    const scored = creators.map(c => {
      const { score, reasons } = scoreCreator(c, body);
      return { creator: c, score, reasons };
    });
    scored.sort((a,b) => b.score - a.score);
    const top = scored.slice(0,5);

    const explanations: Record<string,string> = {};
    try {
      const messages = [
        {
          role: 'system',
          content: [
            'You help brands understand why creators match their campaign.',
            'For each creator, provide one friendly sentence explaining the fit.',
            'Respond ONLY with JSON array like [{ id: "1", reason: "..." }].'
          ].join('\n')
        },
        {
          role: 'user',
          content: `Campaign goals: ${body.goals || ''}; Tone: ${body.tone || ''}; Platform: ${body.platform || ''}; Audience: ${body.audience || ''}. Creators: ${top.map(t => `${t.creator.id}:${t.creator.name}`).join(', ')}`
        }
      ];
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 })
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '[]';
        const arr = JSON.parse(content);
        if (Array.isArray(arr)) {
          for (const item of arr) {
            if (item && item.id) explanations[item.id] = item.reason || '';
          }
        }
      }
    } catch (err) {
      console.error('gpt explain error', err);
    }

    const results = top.map(t => ({
      creator: t.creator,
      score: t.score,
      reason: explanations[t.creator.id] || t.reasons.join('; ')
    }));

    return NextResponse.json({ matches: results });
  } catch (err) {
    console.error('goal match error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
