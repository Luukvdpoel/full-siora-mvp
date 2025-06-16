import { promises as fs } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

const PERSONAS_DIR = join(process.cwd(), '..', '..', 'data', 'personas');

async function readPersonas(): Promise<Record<string, unknown>[]> {
  try {
    await fs.mkdir(PERSONAS_DIR, { recursive: true });
    const files = await fs.readdir(PERSONAS_DIR);
    const personas: Record<string, unknown>[] = [];
    for (const f of files) {
      if (f.endsWith('.json')) {
        const content = await fs.readFile(join(PERSONAS_DIR, f), 'utf8');
        personas.push(JSON.parse(content));
      }
    }
    return personas;
  } catch {
    return [];
  }
}

export async function GET() {
  const personas = await readPersonas();
  return NextResponse.json(personas);
}

export async function POST(req: Request) {
  const { title, persona } = await req.json();
  if (!title || !persona) {
    return NextResponse.json({ error: 'Missing title or persona' }, { status: 400 });
  }
  await fs.mkdir(PERSONAS_DIR, { recursive: true });
  const iso = new Date().toISOString();
  const datePart = iso.slice(0, 10).replace(/-/g, '');
  const filePath = join(PERSONAS_DIR, `persona-${datePart}.json`);
  await fs.writeFile(filePath, JSON.stringify({ title, persona, timestamp: iso }, null, 2), 'utf8');
  return NextResponse.json({ success: true });
}
