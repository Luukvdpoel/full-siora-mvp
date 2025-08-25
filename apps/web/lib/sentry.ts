import * as Sentry from "@sentry/nextjs";

export function withErrorCapture<T extends (req: Request) => Promise<Response>>(handler: T): T {
  return (async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      Sentry.captureException(err);
      return new Response("Internal error", { status: 500 });
    }
  }) as T;
}
