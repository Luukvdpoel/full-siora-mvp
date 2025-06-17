import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface ApplicationEntry {
  id: string;
  userId: string;
  campaignId: string;
  pitch: string;
  personaSummary: string;
  timestamp: string;
  status?: 'pending' | 'accepted' | 'declined';
}

const dbPath = path.join(process.cwd(), '..', '..', 'db', 'campaign_applications.json');

async function readData(): Promise<ApplicationEntry[]> {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: ApplicationEntry[]) {
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

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const app = data.find(a => a.id === id);
    if (!app) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    app.status = status;
    await writeData(data);
    return NextResponse.json(app);
  } catch (err) {
    console.error('applications PUT error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
