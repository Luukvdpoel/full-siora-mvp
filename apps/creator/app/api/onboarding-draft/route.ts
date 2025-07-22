import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

interface Draft {
  id: string;
  userId: string;
  progress: Record<string, any>;
  updatedAt: string;
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'creator_onboarding_drafts.json');

async function readData(): Promise<Draft[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: Draft[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const data = await readData();
  const draft = data.find((d) => d.userId === userId) || null;
  return NextResponse.json({ draft });
}

export async function POST(req: Request) {
  try {
    const { userId, progress } = await req.json();
    if (!userId || typeof progress !== 'object') {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const data = await readData();
    let draft = data.find((d) => d.userId === userId);
    if (draft) {
      draft.progress = progress;
      draft.updatedAt = new Date().toISOString();
    } else {
      draft = { id: randomUUID(), userId, progress, updatedAt: new Date().toISOString() };
      data.push(draft);
    }
    await writeData(data);
    return NextResponse.json({ id: draft.id });
  } catch (err) {
    console.error('draft save error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
