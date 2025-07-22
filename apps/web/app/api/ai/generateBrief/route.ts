import { callOpenAI, safeJson } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { goal, audience, budget, tone, platform } = await req.json();

    if (!goal || !audience) {
      return new Response(
        JSON.stringify({ error: 'Goal and audience are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userPrompt = [
      `Goal: ${goal}`,
      `Audience: ${audience}`,
      tone ? `Tone: ${tone}` : undefined,
      platform ? `Platform: ${platform}` : undefined,
      budget ? `Budget: ${budget}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You create concise influencer campaign briefs for brands.',
          'Ensure coherence by using the provided tone, target audience and platform.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ blurb: string; deliverables: string[]; kpis: string[] }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          'Goal: Drive app installs',
          'Audience: Gen Z gamers',
          'Tone: bold',
          'Platform: TikTok',
          'Budget: $5000',
        ].join('\n'),
      },
      {
        role: 'assistant',
        content:
          '{"blurb":"Launch a bold TikTok challenge to boost installs.","deliverables":["3 short-form videos"],"kpis":["installs","views"]}',
      },
      { role: 'user', content: userPrompt },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const brief = safeJson(content, {});

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
