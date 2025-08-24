'use client';
import posthog from 'posthog-js';

export function track(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}
