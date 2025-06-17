import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

interface ApplicationRequest {
  campaignId: string;
  pitch: string;
  personaSummary: string;
}

interface ApplicationEntry extends ApplicationRequest {
  id: string;
  userId: string;
  timestamp: string;
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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const data = await readData();
  const apps = data.filter((a) => a.userId === session.user.id);
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { campaignId, pitch, personaSummary } = (await req.json()) as ApplicationRequest;
    if (!campaignId || !pitch) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const entry: ApplicationEntry = {
      id: randomUUID(),
      userId: session.user.id,
      campaignId,
      pitch,
      personaSummary,
      timestamp: new Date().toISOString(),
    };
    data.push(entry);
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    return NextResponse.json(entry);
  } catch (err) {
    console.error('Failed to save application', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
