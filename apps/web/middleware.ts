import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/pricing",
    "/api/health",
    "/waitlist(.*)",
    "/api/waitlist(.*)",
    "/admin/waitlist(.*)",
  ],
});

export const config = {
  matcher: [
    // protect everything by default except publicRoutes
    "/((?!_next|.*\\..*).*)",
  ],
};
