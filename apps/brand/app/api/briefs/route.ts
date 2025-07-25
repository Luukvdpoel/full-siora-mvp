import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

interface Brief {
  id: string;
  name: string;
  goals?: string;
  productInfo?: string;
  idealCreators?: string;
  budget?: string;
  summary: { mission: string; creatorTraits: string[]; platformFormat: string; pitch: string };
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'campaign_briefs.json');

async function readData(): Promise<Brief[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: Brief[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { name, goals, productInfo, idealCreators, budget, summary } = await req.json();
    if (!name || !summary) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const brief: Brief = {
      id: randomUUID(),
      name,
      goals,
      productInfo,
      idealCreators,
      budget,
      summary,
      createdAt: new Date().toISOString(),
    };
    data.push(brief);
    await writeData(data);
    return NextResponse.json({ id: brief.id });
  } catch (err) {
    console.error('brief save error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
