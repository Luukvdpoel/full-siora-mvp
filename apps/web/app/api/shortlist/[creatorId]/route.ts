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

export async function DELETE(req: Request, ctx: any) {
  const { params } = ctx as { params: { creatorId: string } };
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    if (!brandId) {
      return NextResponse.json({ error: 'brandId required' }, { status: 400 });
    }
    const data = await readData();
    const list = data[brandId] ?? [];
    const filtered = list.filter(i => i.creatorId !== params.creatorId);
    data[brandId] = filtered;
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('shortlist DELETE error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: any) {
  const { params } = ctx as { params: { creatorId: string } };
  try {
    const { brandId, notes, tags } = await req.json();
    if (!brandId) {
      return NextResponse.json({ error: 'brandId required' }, { status: 400 });
    }
    const data = await readData();
    const list = data[brandId] ?? [];
    const item = list.find(i => i.creatorId === params.creatorId);
    if (!item) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    item.notes = notes;
    item.tags = tags;
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('shortlist UPDATE error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
