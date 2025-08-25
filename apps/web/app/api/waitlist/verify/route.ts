import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect('/');
  const signup = await prisma.waitlistSignup.findFirst({
    where: { confirmToken: token, confirmExpires: { gt: new Date() } },
  });
  if (!signup) return NextResponse.redirect('/');
  await prisma.waitlistSignup.update({
    where: { id: signup.id },
    data: { confirmedAt: new Date(), confirmToken: null, confirmExpires: null },
  });
  const url = new URL(`/waitlist/thank-you?code=${signup.referralCode}&verified=1`, req.url);
  return NextResponse.redirect(url.toString());
}
