export async function POST(req: Request) {
  const { captions } = await req.json();

  if (!captions || !Array.isArray(captions) || captions.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Captions array required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const prompt = `You are a brand strategist. Using the following social media captions, infer the creator's persona and respond with a JSON object containing personaName, tagline, tone, interests, audience, and summary. Only return valid JSON without markdown.\n\nCaptions:\n${captions.join('\n')}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content ?? '';

  return new Response(message, {
    headers: { 'Content-Type': 'application/json' },
  });
}
