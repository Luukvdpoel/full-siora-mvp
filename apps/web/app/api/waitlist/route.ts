import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      role,
      igHandle,
      name,
      company,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      referredBy,
      notes,
    } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    let signup = await prisma.waitlistSignup.findUnique({ where: { email } });
    if (!signup) {
      const referralCode = crypto.randomUUID();
      const ua = req.headers.get('user-agent') || undefined;
      const referrer = req.headers.get('referer') || undefined;
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim();
      const ipHash = ip ? crypto.createHash('sha256').update(ip + (ua || '')).digest('hex') : undefined;

      let inviterCode: string | undefined = typeof referredBy === 'string' ? referredBy : undefined;
      if (inviterCode === referralCode) inviterCode = undefined;

      signup = await prisma.waitlistSignup.create({
        data: {
          email,
          role,
          igHandle,
          name,
          company,
          source,
          utmSource,
          utmMedium,
          utmCampaign,
          referrer,
          userAgent: ua,
          ipHash,
          notes,
          referralCode,
          referredBy: inviterCode,
        },
      });

      if (inviterCode) {
        await prisma.waitlistSignup.update({
          where: { referralCode: inviterCode },
          data: { referrals: { increment: 1 } },
        });

        if (process.env.SLACK_WEBHOOK_URL) {
          const inviter = await prisma.waitlistSignup.findUnique({
            where: { referralCode: inviterCode },
          });
          const inviterLabel = inviter?.email || inviterCode;
          await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: `Referral: ${email} was invited by ${inviterLabel}` }),
          });
        }
      }
    }

    return NextResponse.json({ referralCode: signup.referralCode });
  } catch (err) {
    console.error('waitlist POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
