import { authMiddleware } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});

export default authMiddleware({
  publicRoutes: ["/", "/pricing", "/api/health"],
  async afterAuth(auth, req) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) return new Response("Too many requests", { status: 429 });
  },
});

export const config = {
  matcher: [
    // protect everything by default except publicRoutes
    "/((?!_next|.*\\..*).*)",
  ],
};
