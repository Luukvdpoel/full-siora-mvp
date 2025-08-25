import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface MatchEntry {
  id: string;
  campaignId: string;
  creatorId: string;
  timestamp: string;
  applicationId?: string;
}

const dbPath = path.join(process.cwd(), '..', '..', 'db', 'matches.json');

async function readData(): Promise<MatchEntry[]> {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: MatchEntry[]) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const data = await readData();
    const matches = campaignId ? data.filter(m => m.campaignId === campaignId) : data;
    return NextResponse.json(matches);
  } catch (err) {
    console.error('matches GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { campaignId, creatorId, applicationId } = await req.json();
    if (!campaignId || !creatorId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const entry: MatchEntry = {
      id: randomUUID(),
      campaignId,
      creatorId,
      timestamp: new Date().toISOString(),
      applicationId,
    };
    data.push(entry);
    await writeData(data);
    return NextResponse.json(entry);
  } catch (err) {
    console.error('matches POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
