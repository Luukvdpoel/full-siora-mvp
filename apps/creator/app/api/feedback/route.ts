import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

interface FeedbackRequest {
  message: string;
  rating: number;
  role: 'brand' | 'creator';
}

interface FeedbackEntry extends FeedbackRequest {
  id: string;
  userId: string;
  timestamp: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { message, rating, role } = (await req.json()) as FeedbackRequest;
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (!['brand', 'creator'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), '..', '..', 'db', 'feedback.json');
    let data: FeedbackEntry[] = [];
    try {
      const file = await fs.readFile(dbPath, 'utf8');
      data = JSON.parse(file);
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }

    const entry: FeedbackEntry = {
      id: randomUUID(),
      userId: session.user.id,
      message,
      rating: numRating,
      role,
      timestamp: new Date().toISOString(),
    };
    data.push(entry);
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json(entry);
  } catch (err) {
    console.error('Failed to save feedback', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
