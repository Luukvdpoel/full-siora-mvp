import { callOpenAI } from 'shared-utils';

interface EvalRequest {
  brand?: { name?: string; [key: string]: any };
  creator?: { name?: string; [key: string]: any };
  performance?: string;
  communication?: string;
  results?: string;
  feedback?: string;
}

interface Scorecard {
  rating: number;
  notes: string;
}

interface EvalResponse {
  brand: Scorecard;
  creator: Scorecard;
  suggestions: string[];
}

export async function POST(req: Request) {
  try {
    const body: EvalRequest = await req.json();

    const summary = [
      body.performance ? `Performance: ${body.performance}` : undefined,
      body.communication ? `Communication: ${body.communication}` : undefined,
      body.results ? `Results: ${body.results}` : undefined,
      body.feedback ? `Feedback: ${body.feedback}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You evaluate influencer marketing campaigns after completion.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ brand: { rating: number; notes: string }, creator: { rating: number; notes: string }, suggestions: string[] }',
          'Rating is from 1 (poor) to 5 (excellent).'
        ].join('\n')
      },
      {
        role: 'user',
        content: [
          `Brand: ${body.brand?.name ?? ''}`,
          `Creator: ${body.creator?.name ?? ''}`,
          summary
        ].filter(Boolean).join('\n')
      }
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const data: EvalResponse = JSON.parse(content);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('post-campaign evaluation error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
