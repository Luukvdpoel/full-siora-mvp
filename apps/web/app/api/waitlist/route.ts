import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const webhook = process.env.WAITLIST_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    }

    const approved = process.env.APPROVED_DOMAINS?.split(',').map(d => d.trim().toLowerCase()) || [];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && approved.includes(domain) && process.env.INVITE_WEBHOOK_URL) {
      await fetch(process.env.INVITE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('waitlist POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
