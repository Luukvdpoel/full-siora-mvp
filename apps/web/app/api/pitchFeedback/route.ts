import { callOpenAI } from 'shared-utils';
import type { PitchFeedback } from '@/types/pitch';

export async function POST(req: Request) {
  try {
    const { pitch, personaSummary, brand } = await req.json();
    if (!pitch || !personaSummary || !brand) {
      return new Response(
        JSON.stringify({ error: 'pitch, personaSummary and brand required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You evaluate influencer pitches for brand collaborations.',
          'Summarize creator-brand fit and suggest any content or tone adjustments.',
          'Rate the pitch from the brand\'s perspective on a 1-5 scale for strength, clarity and uniqueness.',
          'Tag issues like "too vague" or "not tailored" if relevant.',
          'Respond ONLY with JSON matching this TypeScript interface:',
          '{ fitSummary: string; adjustments: string[]; ratings: { strength: number; clarity: number; uniqueness: number }; tags: string[] }'
        ].join('\n')
      },
      { role: 'user', content: JSON.stringify({ pitch, personaSummary, brand }) }
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const feedback: PitchFeedback = JSON.parse(content);
    return new Response(JSON.stringify(feedback), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('pitchFeedback error', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
