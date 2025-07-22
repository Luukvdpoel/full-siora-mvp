import { callOpenAI } from 'shared-utils';

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

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
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
