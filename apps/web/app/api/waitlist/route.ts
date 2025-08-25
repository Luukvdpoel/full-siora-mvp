import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import dns from 'dns/promises';
import { Resend } from 'resend';

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
        website,
      } = body;

      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
      }
      if (website) {
        return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
      }

      const domain = email.split('@')[1];
      try {
        await Promise.race([
          dns.resolveMx(domain),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
        ]);
      } catch {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
      }

      const ua = req.headers.get('user-agent') || undefined;
      const referrer = req.headers.get('referer') || undefined;
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim();
      const ipHash = ip ? crypto.createHash('sha256').update(ip + (ua || '')).digest('hex') : undefined;

      const recent = await prisma.waitlistSignup.findFirst({
        where: {
          createdAt: { gt: new Date(Date.now() - 60 * 1000) },
          OR: [{ email }, ipHash ? { ipHash } : {}],
        },
      });
      if (recent) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }

      let signup = await prisma.waitlistSignup.findUnique({ where: { email } });
      if (!signup) {
        const referralCode = crypto.randomUUID();
        let inviterCode: string | undefined = typeof referredBy === 'string' ? referredBy : undefined;
        if (inviterCode === referralCode) inviterCode = undefined;
        const confirmToken = crypto.randomBytes(32).toString('hex');
        const confirmExpires = new Date(Date.now() + 72 * 3600 * 1000);

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
            confirmToken,
            confirmExpires,
          },
        });

        if (process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://usesiora.com';
          const verifyUrl = `${base}/api/waitlist/verify?token=${confirmToken}`;
          await resend.emails.send({
            from: 'Siora <noreply@usesiora.com>',
            to: email,
            subject: 'Confirm your spot on Siora\u2019s waitlist',
            html: `<p>Thanks for joining Siora!</p><p><a href="${verifyUrl}">Confirm email</a></p>`,
          });
        }

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
