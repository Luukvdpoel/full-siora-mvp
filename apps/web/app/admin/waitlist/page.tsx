import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

interface Props {
  searchParams: { role?: string; confirmed?: string };
}

export default async function AdminWaitlistPage({ searchParams }: Props) {
  const auth = headers().get('authorization');
  if (process.env.ADMIN_TOKEN && auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return <div>Unauthorized</div>;
  }

  const where: any = {};
  if (searchParams.role) where.role = searchParams.role;
  if (searchParams.confirmed === 'true') where.confirmedAt = { not: null };
  if (searchParams.confirmed === 'false') where.confirmedAt = null;

  const signups = await prisma.waitlistSignup.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-8 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Waitlist</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="border-b border-zinc-700 p-2">Email</th>
            <th className="border-b border-zinc-700 p-2">Role</th>
            <th className="border-b border-zinc-700 p-2">igHandle</th>
            <th className="border-b border-zinc-700 p-2">Created</th>
            <th className="border-b border-zinc-700 p-2">Referrals</th>
            <th className="border-b border-zinc-700 p-2">Confirmed</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s) => (
            <tr key={s.id} className="border-b border-zinc-800">
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.role}</td>
              <td className="p-2">{s.igHandle}</td>
              <td className="p-2">{s.createdAt.toISOString()}</td>
              <td className="p-2">{s.referrals}</td>
              <td className="p-2">{s.confirmedAt ? s.confirmedAt.toISOString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
