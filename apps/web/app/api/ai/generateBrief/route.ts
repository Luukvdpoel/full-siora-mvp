import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { goal, audience, budget } = await req.json();

    if (!goal || !audience) {
      return new Response(
        JSON.stringify({ error: 'Goal and audience are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userPrompt = [
      `Goal: ${goal}`,
      `Audience: ${audience}`,
      budget ? `Budget: ${budget}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You generate short influencer campaign briefs.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ blurb: string; deliverables: string[]; kpis: string[] }',
        ].join('\n'),
      },
      { role: 'user', content: userPrompt },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const brief = JSON.parse(content);

    return new Response(JSON.stringify(brief), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('generateBrief error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
