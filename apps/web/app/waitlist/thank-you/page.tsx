import ReferralLinkBox from "@/components/waitlist/ReferralLinkBox";
import { prisma } from "@/lib/prisma";
import ThankYouClient from "./ThankYouClient";
import Link from "next/link";

interface Props {
  searchParams: { code?: string; verified?: string };
}

export default async function ThankYouPage({ searchParams }: Props) {
  const code = searchParams.code || "";
  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="text-center space-y-4">
          <p>We couldn’t find your spot.</p>
          <Link href="/" className="text-indigo-400 hover:underline">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const signup = await prisma.waitlistSignup.findUnique({
    where: { referralCode: code },
    select: { referrals: true, confirmedAt: true },
  });
  if (!signup) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="text-center space-y-4">
          <p>We couldn’t find your spot.</p>
          <Link href="/" className="text-indigo-400 hover:underline">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const referrals = signup.referrals;
  const verified = Boolean(searchParams.verified);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <ThankYouClient verified={verified} />
      <div className="max-w-md w-full space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
        {!signup.confirmedAt && (
          <p className="rounded-md bg-yellow-500/10 p-2 text-sm text-yellow-500">
            Please confirm your email—check your inbox.
          </p>
        )}
        <h1 className="text-2xl font-semibold">You’re in. Invite friends for earlier access.</h1>
        <div className="flex justify-center">
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
            {referrals}/5
          </span>
        </div>
        <div className="space-y-2">
          <ReferralLinkBox code={code} />
        </div>
      </div>
    </main>
  );
}
