import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import { creators } from "../../data/creators";

interface Match {
  id: string;
  creatorId: string;
  brandName: string;
  message: string;
  timestamp: string;
}

interface ContactRequest {
  creatorId: string;
  brandName: string;
  campaign?: string;
}

export async function POST(req: Request) {
  try {
    const { creatorId, brandName, campaign } = (await req.json()) as ContactRequest;
    if (!creatorId || !brandName) {
      return NextResponse.json({ error: 'Missing creatorId or brandName' }, { status: 400 });
    }

    const creator = creators.find(c => c.id === creatorId);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const message =
      `Hi ${creator.name}, I'm reaching out from ${brandName}. ` +
      `We love your ${creator.niche} content and think you'd be perfect for our ${campaign ?? 'upcoming'} campaign. ` +
      `Let me know if you're interested!`;

    const dbPath = path.join(process.cwd(), '..', '..', 'db', 'matches.json');
    let data: Match[] = [];
    try {
      const file = await fs.readFile(dbPath, 'utf8');
      data = JSON.parse(file);
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }

    data.push({ id: randomUUID(), creatorId, brandName, message, timestamp: new Date().toISOString() });
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message });
  } catch (err) {
    console.error('Failed to contact creator', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
