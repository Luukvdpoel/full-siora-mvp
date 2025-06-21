import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), '..', '..', 'data', 'personas.json');

type Persona = Record<string, unknown> & {
  id: string;
  handle: string;
  result?: unknown;
  tone?: string;
  goal?: string;
  platform?: string;
  createdAt: string;
};

async function readPersonas(): Promise<Persona[]> {
  try {
    const file = await fs.readFile(DATA_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? (data as Persona[]) : [];
  } catch {
    return [];
  }
}

async function writePersonas(personas: Persona[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(personas, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, result, tone, goal, platform, createdAt } = body;
    if (!handle) {
      return NextResponse.json({ error: 'handle required' }, { status: 400 });
    }

    const personas = await readPersonas();
    const newPersona: Persona = {
      id: Date.now().toString(),
      handle,
      result,
      tone,
      goal,
      platform,
      createdAt: createdAt || new Date().toISOString(),
      ...body,
    };
    personas.push(newPersona);
    await writePersonas(personas);

    return NextResponse.json(newPersona);
  } catch (err) {
    console.error('personas POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
