import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/api/health"]);

export default clerkMiddleware(async (auth, req) => {
  const ref = req.nextUrl.searchParams.get("ref");
  if (ref) {
    const res = NextResponse.next();
    res.cookies.set("referral", ref, { maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (!isPublicRoute(req)) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) return new Response("Too many requests", { status: 429 });

    await auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // protect everything by default except publicRoutes
    "/((?!_next|.*\\..*).*)",
  ],
};
