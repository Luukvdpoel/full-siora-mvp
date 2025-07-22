import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions, prisma } from '@lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { values, tone, experience, niche } = await req.json();
  if (!values || !tone || !experience || !niche) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const messages = [
    {
      role: 'system',
      content: [
        'You are a branding expert that writes short creator personas in Markdown.',
        'Use the provided values, tone, experience and niche to craft a concise description.'
      ].join(' '),
    },
    { role: 'user', content: JSON.stringify({ values, tone, experience, niche }) },
  ];

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 }),
  });

  if (!aiRes.ok) {
    const text = await aiRes.text();
    return NextResponse.json({ error: 'OpenAI error', details: text }, { status: aiRes.status });
  }

  const data = await aiRes.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  const saved = await prisma.persona.create({
    data: {
      title: 'Persona',
      data: content,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ id: saved.id, persona: content });
}
