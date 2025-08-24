import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage({ searchParams }: { searchParams: { role?: string; confirmed?: string } }) {
  const auth = headers().get("authorization");
  const token = process.env.ADMIN_TOKEN;
  if (token && auth !== `Bearer ${token}`) {
    return (
      <div className="py-20 text-center">
        <p>Unauthorized</p>
      </div>
    );
  }

  const where: any = {};
  if (searchParams.role) where.role = searchParams.role.toUpperCase();
  if (searchParams.confirmed === "true") where.confirmedAt = { not: null };
  if (searchParams.confirmed === "false") where.confirmedAt = null;

  const signups = await prisma.waitlistSignup.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  const referralCounts = await Promise.all(
    signups.map((s) => prisma.waitlistSignup.count({ where: { referredBy: s.referralCode } }))
  );

  return (
    <div className="py-10">
      <h1 className="mb-6 text-2xl font-semibold">Waitlist</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">IG</th>
            <th className="p-2">Created</th>
            <th className="p-2">Referrals</th>
            <th className="p-2">Confirmed</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s, i) => (
            <tr key={s.id} className="border-t border-zinc-800">
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.role}</td>
              <td className="p-2">{s.igHandle || ""}</td>
              <td className="p-2">{s.createdAt.toISOString()}</td>
              <td className="p-2">{referralCounts[i]}</td>
              <td className="p-2">{s.confirmedAt ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
