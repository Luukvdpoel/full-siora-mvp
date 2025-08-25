import * as Sentry from "@sentry/nextjs";

export function withErrorReporting<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      Sentry.captureException(err);
      return new Response("Internal error", { status: 500 });
    }
  }) as T;
}
