import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface ShortlistItem {
  creatorId: string;
  notes?: string;
  tags?: string[];
}

type ShortlistDB = Record<string, ShortlistItem[]>;

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'shortlist.json');

async function readData(): Promise<ShortlistDB> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return data && typeof data === 'object' ? (data as ShortlistDB) : {};
  } catch {
    return {};
  }
}

async function writeData(data: ShortlistDB) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const { brandId, creatorId, notes, tags } = await req.json();
    if (!brandId || !creatorId) {
      return NextResponse.json({ error: 'brandId and creatorId required' }, { status: 400 });
    }
    const data = await readData();
    const list = data[brandId] ?? [];
    const existing = list.find(i => i.creatorId === creatorId);
    if (existing) {
      return NextResponse.json({ error: 'Creator already shortlisted' }, { status: 400 });
    }
    list.push({ creatorId, notes, tags });
    data[brandId] = list;
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('shortlist ADD error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
