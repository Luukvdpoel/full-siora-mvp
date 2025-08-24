import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// simple in-memory rate limit per email
const recent = new Map<string, number>();

const bodySchema = z.object({
  email: z.string().email(),
  role: z.string().optional(),
  igHandle: z.string().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const emailKey = data.email.toLowerCase();
    const now = Date.now();
    const last = recent.get(emailKey) || 0;
    if (now - last < 60_000) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    recent.set(emailKey, now);

    const url = new URL(req.url);
    const utmSource = url.searchParams.get('utm_source') || undefined;
    const utmMedium = url.searchParams.get('utm_medium') || undefined;
    const utmCampaign = url.searchParams.get('utm_campaign') || undefined;
    const source = url.searchParams.get('source') || data.source;

    const referrer = req.headers.get('referer') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      undefined;

    let ipHash: string | undefined;
    if (ip && process.env.IP_HASH_SALT) {
      ipHash = crypto
        .createHash('sha256')
        .update(ip + process.env.IP_HASH_SALT)
        .digest('hex');
    }

    const record = {
      email: data.email,
      role: data.role,
      igHandle: data.igHandle,
      name: data.name,
      company: data.company,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      userAgent,
      ipHash,
    };

    await prisma.waitlistSignup.upsert({
      where: { email: data.email },
      update: record,
      create: record,
    });

    if (process.env.SLACK_WEBHOOK_URL) {
      const text = `New waitlist: ${data.email} (${data.role || 'unknown'}) – ${
        utmSource || 'no-source'
      }/${utmCampaign || ''} – ${data.igHandle || ''}`;
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    }

    let emailSent = false;
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM,
          to: data.email,
          subject: 'Welcome to Siora waitlist',
          html: '<p>Thanks for joining the Siora waitlist.</p>',
        }),
      });
      emailSent = res.ok;
    }

    if (process.env.POSTHOG_API_KEY) {
      await fetch('https://app.posthog.com/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_API_KEY,
          event: 'waitlist_signup',
          properties: {
            email: data.email,
            role: data.role,
            source,
            utmSource,
            utmCampaign,
          },
        }),
      });
    }

    return NextResponse.json({ ok: true, emailSent });
  } catch (err) {
    console.error('waitlist POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

