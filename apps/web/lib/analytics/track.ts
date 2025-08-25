import posthog from 'posthog-js';

export const track = (event: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  if (!posthog.__loaded) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    });
  }
  posthog.capture(event, properties);
};
