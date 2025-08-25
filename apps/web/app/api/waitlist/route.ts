import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import { Resend } from "resend";

const bodySchema = z.object({
  email: z.string().email(),
  role: z.string().optional(),
  igHandle: z.string().optional(),
});

const rateLimit = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, role, igHandle } = bodySchema.parse(json);

    const url = new URL(req.url);
    const utmSource = url.searchParams.get("utm_source") || undefined;
    const utmMedium = url.searchParams.get("utm_medium") || undefined;
    const utmCampaign = url.searchParams.get("utm_campaign") || undefined;

    const now = Date.now();
    const last = rateLimit.get(email);
    if (last && now - last < 60_000) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    rateLimit.set(email, now);

    const userAgent = req.headers.get("user-agent") || undefined;
    const referrer = req.headers.get("referer") || undefined;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    let ipHash: string | undefined;
    if (ip && process.env.IP_HASH_SALT) {
      ipHash = crypto
        .createHash("sha256")
        .update(ip + process.env.IP_HASH_SALT)
        .digest("hex");
    }

    const data = {
      email,
      role,
      igHandle,
      source: url.searchParams.get("source") || undefined,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      userAgent,
      ipHash,
    };

    await prisma.waitlistSignup.upsert({
      where: { email },
      update: data,
      create: { ...data, email },
    });

    if (process.env.SLACK_WEBHOOK_URL) {
      const text = `New waitlist: ${email} (${role ?? "?"}) – ${utmSource ?? ""}/${
        utmCampaign ?? ""
      } – ${igHandle ?? ""}`;
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    }

    let emailed = false;
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || "hello@usesiora.com",
        to: email,
        subject: "Welcome to Siora waitlist",
        html: `<p>Thanks for joining Siora!</p>`
      });
      emailed = true;
    }

    if (process.env.POSTHOG_API_KEY) {
      await fetch(`${process.env.POSTHOG_HOST || "https://app.posthog.com"}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_API_KEY,
          event: "waitlist_signup",
          properties: { email, role, utmSource, utmMedium, utmCampaign },
        }),
      });
    }

    return NextResponse.json({ ok: true, emailed });
  } catch (err) {
    console.error("waitlist POST error", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export const GET = () => NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
