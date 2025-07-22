import { callOpenAI, safeJson } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { name, tone, values, audience, platform } = await req.json();

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
      audience ? `Audience: ${audience}` : undefined,
      platform ? `Platform: ${platform}` : undefined,
      `Core values: ${valuesStr}`,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You are a brand strategist crafting concise personas to help brands collaborate with creators.',
          'Incorporate the provided tone, target audience and platform into the persona.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ bio: string; tone: string; values: string[]; dos: string[]; donts: string[] }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          'Name: EcoBrand',
          'Tone: friendly',
          'Audience: eco-conscious millennials',
          'Platform: Instagram',
          'Core values: sustainability, transparency',
        ].join('\n'),
      },
      {
        role: 'assistant',
        content:
          '{"bio":"EcoBrand promotes sustainable living.","tone":"friendly","values":["sustainability","transparency"],"dos":["Highlight eco products"],"donts":["Use generic stock photos"]}',
      },
      { role: 'user', content: userPrompt },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const persona = safeJson(content, {});

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
