import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

type FeedbackType = 'brand_to_creator' | 'creator_to_brand';
interface Feedback {
  id: string;
  brandId: string;
  creatorId: string;
  rating: number;
  communication: number;
  reliability: number;
  comments: string;
  type: FeedbackType;
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
  const creatorId = searchParams.get('creatorId');
  const brandId = searchParams.get('brandId');
  const data = await readData();
  const filtered = data.filter(f => {
    if (creatorId && f.creatorId !== creatorId) return false;
    if (brandId && f.brandId !== brandId) return false;
    return true;
  });
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  try {
    const {
      brandId,
      creatorId,
      rating,
      communication,
      reliability,
      comments,
      type,
    } = await req.json();
    if (!brandId || !creatorId) {
      return NextResponse.json({ error: 'brandId and creatorId required' }, { status: 400 });
    }
    const numRating = Number(rating);
    const numComm = Number(communication);
    const numRel = Number(reliability);
    if ([numRating, numComm, numRel].some(n => Number.isNaN(n) || n < 1 || n > 5)) {
      return NextResponse.json({ error: 'ratings must be 1-5' }, { status: 400 });
    }
    const entry: Feedback = {
      id: randomUUID(),
      brandId,
      creatorId,
      rating: numRating,
      communication: numComm,
      reliability: numRel,
      comments: comments || '',
      type: type === 'creator_to_brand' ? 'creator_to_brand' : 'brand_to_creator',
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
