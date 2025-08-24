import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/pricing", "/api/health"],
});

export const config = {
  matcher: [
    // protect everything by default except publicRoutes
    "/((?!_next|.*\\..*).*)",
  ],
};
