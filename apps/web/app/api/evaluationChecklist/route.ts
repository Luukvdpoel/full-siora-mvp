export async function POST(req: Request) {
  try {
    const { persona, campaign } = await req.json();

    if (!persona || typeof persona !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Creator persona is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!campaign || typeof campaign !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Campaign details are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { goal, tone, audience } = campaign;

    const details = [
      goal ? `Goal: ${goal}` : undefined,
      tone ? `Tone: ${tone}` : undefined,
      audience ? `Audience: ${audience}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      {
        role: 'system',
        content: [
          'You evaluate whether a creator persona fits a brand campaign.',
          'Return a Markdown checklist with these headings:',
          '🎯 Audience Fit',
          '💡 Content Style & Voice',
          '📊 Performance Potential',
          '🤝 Brand Alignment',
          '✅ Red Flags / Cautions',
          'Finish with a single line starting "**✅ Final Verdict:**" with a confidence score out of 10.'
        ].join('\n')
      },
      {
        role: 'user',
        content: `Creator persona: ${JSON.stringify(persona)}\nCampaign details:\n${details}`
      }
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

    return new Response(JSON.stringify({ checklist: content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('evaluation checklist error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
