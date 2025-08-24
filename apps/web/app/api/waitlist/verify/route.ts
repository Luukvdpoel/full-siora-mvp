import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect("/");
  }

  const signup = await prisma.waitlistSignup.findFirst({
    where: { confirmToken: token, confirmExpires: { gt: new Date() } },
  });
  if (!signup) {
    return NextResponse.redirect("/");
  }

  await prisma.waitlistSignup.update({
    where: { id: signup.id },
    data: { confirmedAt: new Date(), confirmToken: null, confirmExpires: null },
  });

  return NextResponse.redirect(`/waitlist/thank-you?code=${signup.referralCode}&verified=1`);
}
