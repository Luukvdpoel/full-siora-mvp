import 'server-only';

export async function trackServer(event: string, properties?: Record<string, any>) {
  const key = process.env.POSTHOG_KEY;
  if (!key) return;
  try {
    await fetch('https://app.posthog.com/capture/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        event,
        properties,
      }),
    });
  } catch {
    // ignore errors
  }
}
