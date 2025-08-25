import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Provide a topic string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You brainstorm short content ideas for social media posts.',
          'Return ONLY JSON in the form { "ideas": string[] } with five ideas.'
        ].join('\n')
      },
      { role: 'user', content: topic }
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const result = JSON.parse(content) as { ideas: string[] };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
