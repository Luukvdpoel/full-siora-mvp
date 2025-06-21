export async function POST(req: Request) {
  try {
    const {
      brand,
      handle,
      deliverables,
      dates,
      payment,
      terms,
      notes,
    } = await req.json();

    if (!brand || !handle || !deliverables || !dates || !payment || !terms) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt =
      "You're a legal assistant for influencer-brand deals. Based on the following campaign info, generate a clean influencer-brand contract in Markdown format. Use simple, clear language that's legally sound but easy to read.";

    const userPrompt = [
      'Details:',
      `- Brand: ${brand}`,
      `- Creator handle: ${handle}`,
      `- Deliverables: ${deliverables}`,
      `- Campaign Dates: ${dates}`,
      `- Payment: ${payment}`,
      `- Payment Terms: ${terms}`,
      notes ? `- Extra Notes: ${notes}` : undefined,
      '',
      'Contract should include:',
      '- Campaign Scope',
      '- Payment Terms',
      '- Content Usage Rights',
      '- Disclosure Obligations',
      '- Cancellation Clause',
      '- Signature Lines (Creator + Brand)',
    ]
      .filter(Boolean)
      .join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.5 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: 'OpenAI error', details: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const contract = data.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ contract }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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
