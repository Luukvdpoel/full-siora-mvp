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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 })
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
