import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  role: z.string().optional(),
  igHandle: z.string().optional(),
  source: z.string().optional(),
});

const rateLimit = new Map<string, number>();

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const parse = bodySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { email, role, igHandle, source } = parse.data;

    const now = Date.now();
    const last = rateLimit.get(email);
    if (last && now - last < 60_000) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    rateLimit.set(email, now);

    const url = new URL(req.url);
    const utmSource = url.searchParams.get('utm_source') || undefined;
    const utmMedium = url.searchParams.get('utm_medium') || undefined;
    const utmCampaign = url.searchParams.get('utm_campaign') || undefined;

    const referrer = req.headers.get('referer') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim();
    const ipHash = ip
      ? crypto
          .createHash('sha256')
          .update(ip + (process.env.IP_HASH_SALT || ''))
          .digest('hex')
      : undefined;

    const data = {
      email,
      role,
      igHandle,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      userAgent,
      ipHash,
    };

    await prisma.waitlistSignup.upsert({
      where: { email },
      update: data,
      create: data,
    });

    if (process.env.SLACK_WEBHOOK_URL) {
      const text = `New waitlist: ${email}${role ? ` (${role})` : ''} – ${utmSource || 'direct'}/${
        utmCampaign || ''
      } – ${igHandle || ''}`;
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    }

    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'hello@usesiora.com',
          to: email,
          subject: 'Welcome to Siora waitlist',
          html: '<p>Thanks for joining the Siora waitlist.</p>',
        }),
      });
    }

    if (process.env.POSTHOG_API_KEY) {
      await fetch('https://app.posthog.com/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_API_KEY,
          event: 'waitlist_signup',
          properties: { email, role, source, utmSource, utmMedium, utmCampaign },
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('waitlist POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
