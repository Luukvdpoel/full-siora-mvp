import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Campaign description required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You create short influencer marketing checklists for brands.',
          'Return 5-7 concise bullet items as JSON array of strings.',
          'Use the campaign description as context.'
        ].join('\n')
      },
      { role: 'user', content: description }
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '[]' });
    const checklist = JSON.parse(content);

    return new Response(JSON.stringify({ checklist }), {
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
