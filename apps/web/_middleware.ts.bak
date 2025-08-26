import { clerkMiddleware } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Initialize the rate limiter only when the required environment variables are present.
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
  });
}

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/pricing",
    "/waitlist",
    "/privacy",
    "/terms",
    "/s/(.*)",
    "/api/health",
    "/api/waitlist",
  ],
  async beforeAuth(req) {
    const ref = req.nextUrl.searchParams.get("ref");
    if (ref) {
      const res = NextResponse.next();
      res.cookies.set("referral", ref, { maxAge: 60 * 60 * 24 * 30 });
      return res;
    }
  },
  async afterAuth(auth, req) {
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) return new Response("Too many requests", { status: 429 });
    }
  },
});

export const config = {
  matcher: [
    // protect everything by default except publicRoutes
    "/((?!_next|.*\\..*).*)",
  ],
};
