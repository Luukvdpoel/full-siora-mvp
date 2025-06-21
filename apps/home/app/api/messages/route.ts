import { NextResponse } from 'next/server';

interface Message {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
}

const messages: Message[] = [];

export async function POST(req: Request) {
  try {
    const { senderId, recipientId, message, timestamp } = await req.json();

    if (!senderId || !recipientId || !message || !timestamp) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newMessage: Message = { senderId, recipientId, message, timestamp };
    messages.push(newMessage);

    return NextResponse.json({ message: newMessage });
  } catch (err) {
    console.error('messages POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user1 = searchParams.get('user1');
    const user2 = searchParams.get('user2');

    if (!user1 || !user2) {
      return NextResponse.json({ error: 'user1 and user2 required' }, { status: 400 });
    }

    const convo = messages.filter(
      (m) =>
        (m.senderId === user1 && m.recipientId === user2) ||
        (m.senderId === user2 && m.recipientId === user1)
    );

    return NextResponse.json({ messages: convo });
  } catch (err) {
    console.error('messages GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
