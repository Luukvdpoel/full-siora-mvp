import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface Application {
  id: string;
  userId: string;
  campaignId: string;
  pitch: string;
  personaSummary: string;
  timestamp: string;
  status?: 'pending' | 'accepted' | 'declined';
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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await readData();
    const apps = data.filter(a => a.campaignId === params.id);
    return NextResponse.json(apps);
  } catch (err) {
    console.error('failed to load applications', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
