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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    const data = await readData();
    if (!brandId) {
      return NextResponse.json(data);
    }
    const items = data[brandId] ?? [];
    return NextResponse.json(items);
  } catch (err) {
    console.error('shortlist GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
