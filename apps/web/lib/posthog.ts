import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window === 'undefined') return
  if (posthog.__loaded) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  })
}
