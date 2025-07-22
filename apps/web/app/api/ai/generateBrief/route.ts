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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: 'OpenAI error', details: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '{}';
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
