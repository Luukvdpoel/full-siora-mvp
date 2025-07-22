import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface FeedbackSummary {
  overallTone: string;
  collaborationHighlights: string;
  thingsToImprove: string;
}

interface Feedback {
  id: string;
  forId: string;
  rating: number;
  communication: number;
  reliability: number;
  comments: string;
  summary?: FeedbackSummary;
  timestamp: string;
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'feedback.json');

async function readData(): Promise<Feedback[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: Feedback[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const forId = searchParams.get('forId');
  const data = await readData();
  const filtered = forId ? data.filter((f) => f.forId === forId) : data;
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  try {
    const { forId, rating, communication, reliability, comments } = await req.json();
    if (!forId) {
      return NextResponse.json({ error: 'forId required' }, { status: 400 });
    }
    const numRating = Number(rating);
    const numComm = Number(communication);
    const numRel = Number(reliability);
    if ([numRating, numComm, numRel].some((n) => Number.isNaN(n) || n < 1 || n > 5)) {
      return NextResponse.json({ error: 'ratings must be 1-5' }, { status: 400 });
    }
    const entry: Feedback = {
      id: randomUUID(),
      forId,
      rating: numRating,
      communication: numComm,
      reliability: numRel,
      comments: comments || '',
      timestamp: new Date().toISOString(),
    };
    const data = await readData();
    data.push(entry);
    await writeData(data);
    return NextResponse.json(entry);
  } catch (err) {
    console.error('feedback save error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
