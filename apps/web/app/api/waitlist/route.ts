import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { randomBytes, createHash } from "crypto";
import { headers } from "next/headers";
import dns from "dns/promises";

export async function POST(req: Request) {
  try {
    const {
      email,
      role,
      igHandle,
      website,
      referredBy,
      utmSource,
      utmMedium,
      utmCampaign,
    } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    if (website) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    const ip = headers().get("x-forwarded-for") || "";
    const ipHash = createHash("sha256").update(ip).digest("hex");
    const recent = await prisma.waitlistSignup.findFirst({
      where: {
        OR: [{ email }, { ipHash }],
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });
    if (recent) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const domain = email.split("@")[1];
    try {
      await Promise.race([
        dns.resolveMx(domain),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000)),
      ]);
    } catch {
      return NextResponse.json({ error: "Invalid email domain" }, { status: 400 });
    }

    const referralCode = randomBytes(4).toString("hex");
    const token = randomBytes(16).toString("hex");
    const confirmExpires = new Date(Date.now() + 72 * 60 * 60 * 1000);

    let refCode: string | undefined;
    if (referredBy) {
      const ref = await prisma.waitlistSignup.findUnique({ where: { referralCode: referredBy } });
      if (ref && ref.email !== email) {
        refCode = referredBy;
      }
    }

    const signup = await prisma.waitlistSignup.create({
      data: {
        email,
        role: role === "brand" ? "BRAND" : "CREATOR",
        igHandle,
        referralCode,
        referredBy: refCode,
        confirmToken: token,
        confirmExpires,
        ipHash,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usesiora.com";
      await resend.emails.send({
        from: "Siora <noreply@usesiora.com>",
        to: email,
        subject: "Confirm your spot on Siora’s waitlist",
        html: `<p>Thanks for joining!</p><p><a href="${baseUrl}/api/waitlist/verify?token=${token}">Confirm email</a></p>`,
      });
    }

    return NextResponse.json({ code: signup.referralCode });
  } catch (err: any) {
    console.error("waitlist POST error", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Already signed up" }, { status: 200 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
