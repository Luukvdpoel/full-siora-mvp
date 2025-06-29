export async function POST(req: Request) {
  try {
    const { caption, tone } = await req.json();
    if (!caption || typeof caption !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Provide a caption string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allowedTones = ['confident', 'playful', 'professional', 'witty'];
    const toneLower =
      typeof tone === 'string' && allowedTones.includes(tone.toLowerCase())
        ? tone.toLowerCase()
        : 'confident';

    const messages = [
      {
        role: 'system',
        content: [
          `You help rewrite social media captions in a ${toneLower} tone.`,
          'Return ONLY JSON in the form { "caption": string }.'
        ].join('\n')
      },
      { role: 'user', content: caption }
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
    const result = JSON.parse(content) as { caption: string };

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
