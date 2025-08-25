'use client';
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics/track'

export default function PostHogProvider() {
  const pathname = usePathname()
  useEffect(() => {
    track('$pageview')
  }, [pathname])
  return null
}
