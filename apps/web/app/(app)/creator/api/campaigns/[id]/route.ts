import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const dbPath = path.join(process.cwd(), '..', '..', 'db', 'campaigns.json');

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(file);
    const list = Array.isArray(data) ? data : [];
    const campaign = list.find((c: { id: string }) => c.id === params.id);
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(campaign);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
