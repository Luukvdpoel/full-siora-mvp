'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { initPostHog } from '@/lib/posthog'

export default function PostHogProvider() {
  const pathname = usePathname()
  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!posthog.__loaded) return
    posthog.capture('$pageview')
  }, [pathname])

  return null
}
