import { promises as fs } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const DB_PATH = join(process.cwd(), '..', '..', 'db', 'personas.json');

async function readDB(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data || '{}');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(join(process.cwd(), '..', '..', 'db'), { recursive: true });
      await fs.writeFile(DB_PATH, '{}', 'utf8');
      return {};
    }
    throw err;
  }
}

async function writeDB(data: Record<string, any[]>) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const sessionId = cookies().get('sessionId')?.value;
  if (!sessionId) {
    return NextResponse.json([]);
  }
  const db = await readDB();
  return NextResponse.json(db[sessionId] || []);
}

export async function POST(req: Request) {
  const { title, persona } = await req.json();
  if (!title || !persona) {
    return NextResponse.json({ error: 'Missing title or persona' }, { status: 400 });
  }
  const cookieStore = cookies();
  let session = cookieStore.get('sessionId')?.value;
  if (!session) {
    session = randomUUID();
    cookieStore.set('sessionId', session, { path: '/' });
  }
  const db = await readDB();
  if (!Array.isArray(db[session])) db[session] = [];
  db[session].push({ title, persona, timestamp: new Date().toISOString() });
  await writeDB(db);
  return NextResponse.json({ success: true });
}
