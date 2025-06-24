import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  pitch?: string;
  personaSummary?: string;
  status: string;
  timestamp: string;
}

const dbPath = path.join(process.cwd(), '..', '..', 'db', 'campaign_applications.json');

async function readData(): Promise<Application[]> {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: Application[]) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('applications GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const idx = data.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    data[idx].status = status;
    await writeData(data);
    return NextResponse.json(data[idx]);
  } catch (err) {
    console.error('applications PATCH error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
