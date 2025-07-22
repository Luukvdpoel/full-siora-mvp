import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email, role } = await req.json();
  if (!email || (role !== 'creator' && role !== 'brand')) {
    return new NextResponse('Invalid data', { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');

  await prisma.invite.create({
    data: { email, token, role },
  });

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const url = `https://usesiora.com/invite/${token}`;
    await transport.sendMail({
      from: process.env.EMAIL_FROM ?? 'noreply@usesiora.com',
      to: email,
      subject: 'You\'re invited to Siora',
      text: `Click the link to sign up: ${url}`,
    });
  } catch (err) {
    console.error('Failed to send invite email', err);
  }

  return NextResponse.json({ ok: true, token });
}
