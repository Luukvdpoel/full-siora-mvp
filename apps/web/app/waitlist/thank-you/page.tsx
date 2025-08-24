import { prisma } from "@/lib/prisma";
import ThankYouClient from "./ThankYouClient";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: { code?: string; verified?: string } }) {
  const code = searchParams.code;
  if (!code) {
    return (
      <div className="py-20 text-center">
        <p>Missing referral code.</p>
        <Link href="/" className="underline">Go back</Link>
      </div>
    );
  }

  const signup = await prisma.waitlistSignup.findUnique({ where: { referralCode: code } });
  if (!signup) {
    return (
      <div className="py-20 text-center">
        <p>We couldn't find your signup.</p>
        <Link href="/" className="underline">Go back</Link>
      </div>
    );
  }

  const referrals = await prisma.waitlistSignup.count({ where: { referredBy: code } });

  return (
    <ThankYouClient
      code={code}
      referrals={referrals}
      confirmed={!!signup.confirmedAt}
      verified={searchParams.verified === "1"}
    />
  );
}
