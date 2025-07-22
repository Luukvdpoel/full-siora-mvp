import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions, prisma } from '@lib/auth';
import path from 'path';
import { promises as fs } from 'fs';

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'creator_onboarding_drafts.json');

interface Draft {
  id: string;
  userId: string;
  progress: Record<string, any>;
  updatedAt: string;
}

async function readDrafts(): Promise<Draft[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeDrafts(data: Draft[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { progress } = await req.json();
  if (!progress || typeof progress !== 'object') {
    return NextResponse.json({ error: 'Missing progress' }, { status: 400 });
  }

  const messages = [
    {
      role: 'system',
      content:
        'You are a branding expert that crafts short creator personas for brand collaborations.'
    },
    { role: 'user', content: JSON.stringify(progress) }
  ];

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 })
  });

  if (!aiRes.ok) {
    const text = await aiRes.text();
    return NextResponse.json({ error: 'OpenAI error', details: text }, { status: aiRes.status });
  }

  const data = await aiRes.json();
  const persona = data.choices?.[0]?.message?.content ?? '';

  await prisma.creatorProfile.create({
    data: {
      userId: session.user.id,
      name: progress.name,
      handle: progress.handle,
      followers: Number(progress.followers) || 0,
      niche: progress.niche,
      tone: progress.tone,
      values: progress.values ?? [],
      contentType: progress.contentType,
      brandPersona: persona
    }
  });

  await prisma.persona.create({
    data: {
      userId: session.user.id,
      title: 'Persona',
      data: persona
    }
  });

  const drafts = await readDrafts();
  const filtered = drafts.filter(d => d.userId !== session.user.id);
  await writeDrafts(filtered);

  return NextResponse.json({ persona });
}
