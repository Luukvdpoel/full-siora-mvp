import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const dbPath = path.join(process.cwd(), '..', '..', 'db', 'campaigns.json');

export async function GET() {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(file);
    const list = Array.isArray(data) ? data : [];
    const now = Date.now();
    const active = list.filter((c: { deadline?: string }) =>
      !c.deadline || Date.parse(c.deadline) > now
    );
    return NextResponse.json(active);
  } catch {
    return NextResponse.json([]);
  }
}
