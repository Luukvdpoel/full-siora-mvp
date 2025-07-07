import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

type MessageDB = Record<string, Message[]>;

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'messages.json');

async function readData(): Promise<MessageDB> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return data && typeof data === 'object' ? data as MessageDB : {};
  } catch {
    return {};
  }
}

async function writeData(data: MessageDB) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    const creatorId = searchParams.get('creatorId');
    if (!brandId || !creatorId) {
      return NextResponse.json({ error: 'brandId and creatorId required' }, { status: 400 });
    }
    const data = await readData();
    const key = `${brandId}_${creatorId}`;
    const messages = data[key] ?? [];
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('messages GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { brandId, creatorId, senderId, receiverId, message } = await req.json();
    if (!brandId || !creatorId || !senderId || !receiverId || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const data = await readData();
    const key = `${brandId}_${creatorId}`;
    const entry = data[key] ?? [];
    const newMessage: Message = {
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    entry.push(newMessage);
    data[key] = entry;
    await writeData(data);
    return NextResponse.json({ message: newMessage });
  } catch (err) {
    console.error('messages POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
