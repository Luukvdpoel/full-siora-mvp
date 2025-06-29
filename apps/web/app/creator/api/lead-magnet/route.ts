export async function POST(req: Request) {
  try {
    const { tone, niche, format } = await req.json();

    if (
      !tone ||
      typeof tone !== 'string' ||
      !niche ||
      typeof niche !== 'string' ||
      !format ||
      typeof format !== 'string'
    ) {
      return new Response(
        JSON.stringify({ error: 'Provide tone, niche and format strings.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You create concise lead magnet ideas for online creators.',
          'Use the provided tone, niche and preferred format to keep suggestions on-brand.',
          'Respond in Markdown with a title as a heading, a short section of three bullet benefits, and a brief content outline.'
        ].join('\n')
      },
      { role: 'user', content: `Tone: ${tone}\nNiche: ${niche}\nFormat: ${format}` }
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
    const content = data.choices?.[0]?.message?.content ?? '';

    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown' }
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
