import { withErrorCapture } from "@/lib/sentry";

export const GET = withErrorCapture(async (_req: Request) => {
  return Response.json({ ok: true, time: new Date().toISOString() });
});
