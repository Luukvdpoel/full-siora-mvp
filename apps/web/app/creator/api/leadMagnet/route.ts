export async function POST(req: Request) {
  try {
    const { niche, audience } = await req.json();

    if (
      !niche ||
      typeof niche !== 'string' ||
      !audience ||
      typeof audience !== 'string'
    ) {
      return new Response(
        JSON.stringify({ error: 'Provide both niche and audience strings.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You generate concise ideas for downloadable resources that creators can offer as lead magnets to grow their email list.',
          'Each idea should include a short title, a one-sentence description, a clear benefit statement, and a compelling call-to-action.',
          'Respond ONLY with JSON in the form { "title": string; "description": string; "benefit": string; "cta": string }.'
        ].join('\n')
      },
      { role: 'user', content: `Niche: ${niche}\nAudience: ${audience}` }
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
    const result = JSON.parse(content) as {
      title: string;
      description: string;
      benefit: string;
      cta: string;
    };

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
