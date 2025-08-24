import ReferralLinkBox from "@/components/waitlist/ReferralLinkBox";
import ReferralProgress from "@/components/waitlist/ReferralProgress";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: { code?: string };
}

export default async function ThankYouPage({ searchParams }: Props) {
  const code = searchParams.code || "";
  const signup = code
    ? await prisma.waitlistSignup.findUnique({
        where: { referralCode: code },
        select: { referrals: true },
      })
    : null;
  const referrals = signup?.referrals || 0;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold">Thanks for joining Siora!</h1>
        <p>You’ve referred {referrals} {referrals === 1 ? "person" : "people"}.</p>
        <ReferralProgress count={referrals} goal={5} />
        <div className="space-y-2">
          <p>Share your link to climb the list:</p>
          <ReferralLinkBox code={code} />
        </div>
      </div>
    </main>
  );
}
