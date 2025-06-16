import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface Message {
  id: string;
  creatorId: string;
  sender: 'brand' | 'creator';
  text: string;
  timestamp: string;
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'messages.json');

async function readData(): Promise<Message[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: Message[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    const data = await readData();
    const messages = creatorId ? data.filter(m => m.creatorId === creatorId) : data;
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('messages GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { creatorId, sender, text } = await req.json();
    if (!creatorId || !sender || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const message: Message = {
      id: randomUUID(),
      creatorId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    data.push(message);
    await writeData(data);
    return NextResponse.json({ message });
  } catch (err) {
    console.error('messages POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
