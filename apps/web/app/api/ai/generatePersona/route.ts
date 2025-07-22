export async function POST(req: Request) {
  try {
    const { name, tone, values } = await req.json();

    if (!tone || !values) {
      return new Response(
        JSON.stringify({ error: 'Values and tone are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const valuesStr = Array.isArray(values) ? values.join(', ') : String(values);
    const userPrompt = [
      name ? `Name: ${name}` : undefined,
      `Tone: ${tone}`,
      `Core values: ${valuesStr}`,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You craft concise brand personas for marketing teams.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ bio: string; tone: string; values: string[]; dos: string[]; donts: string[] }',
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
    const persona = JSON.parse(content);

    return new Response(JSON.stringify(persona), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('generatePersona error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
