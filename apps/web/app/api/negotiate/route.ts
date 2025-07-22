import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { offer, personaSummary, painPoints } = await req.json();
    if (!offer || !personaSummary) {
      return new Response(
        JSON.stringify({ error: 'offer and personaSummary required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You assist creators with polite counter-offers during brand negotiations.',
          'Use any pain points to justify better terms.',
          'Respond in Markdown with a short friendly paragraph.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `Brand offer: ${offer}\nCreator persona: ${personaSummary}\nPain points: ${painPoints || ''}`,
      },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '' });
    return new Response(JSON.stringify({ counter: content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('negotiate error', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
