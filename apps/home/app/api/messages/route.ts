import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

type MessageDB = Record<string, Message[]>;

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'conversations.json');

async function readData(): Promise<MessageDB> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return data && typeof data === 'object' ? (data as MessageDB) : {};
  } catch {
    return {};
  }
}

async function writeData(data: MessageDB) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const { sender, receiver, message } = await req.json();

    if (!sender || !receiver || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const data = await readData();
    const key = [sender, receiver].sort().join('_');
    const entry = data[key] ?? [];
    const newMessage: Message = {
      sender,
      receiver,
      message,
      timestamp: new Date().toISOString(),
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const data = await readData();
    const conversations: MessageDB = {};
    for (const [key, msgs] of Object.entries(data)) {
      const [a, b] = key.split('_');
      if (a === userId || b === userId) {
        conversations[key] = msgs;
      }
    }

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error('messages GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
