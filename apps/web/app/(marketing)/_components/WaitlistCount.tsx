import { prisma } from '@/lib/prisma';

export async function WaitlistCount() {
  const baseline = Number(process.env.WAITLIST_BASELINE ?? '50');
  const count = await prisma.waitlistSignup.count();
  return <>{baseline + count}</>;
}
