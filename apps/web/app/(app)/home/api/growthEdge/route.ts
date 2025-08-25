import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();
    if (!persona || typeof persona !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Persona string required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You are a social media growth consultant for creators.',
          'Provide concise insights based on the given persona.',
          'Respond ONLY with JSON matching this TypeScript interface:',
          '{ strength: string; mistake: string; monetizationOpportunity: string }'
        ].join('\n')
      },
      { role: 'user', content: persona }
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('growthEdge POST error', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
