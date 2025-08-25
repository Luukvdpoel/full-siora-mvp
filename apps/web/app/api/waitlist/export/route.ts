import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (process.env.ADMIN_TOKEN && auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const signups = await prisma.waitlistSignup.findMany({ orderBy: { createdAt: 'desc' } });
  const rows = [
    ['email','role','igHandle','createdAt','referrals','confirmedAt','utmSource','utmMedium','utmCampaign'].join(','),
    ...signups.map(s => [
      s.email,
      s.role ?? '',
      s.igHandle ?? '',
      s.createdAt.toISOString(),
      String(s.referrals),
      s.confirmedAt ? s.confirmedAt.toISOString() : '',
      s.utmSource ?? '',
      s.utmMedium ?? '',
      s.utmCampaign ?? '',
    ].join(','))
  ].join('\n');
  return new NextResponse(rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="waitlist.csv"',
    }
  });
}
