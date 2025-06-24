'use client'

import { useEffect, useState } from 'react'
import { Spinner } from 'shared-ui'
import type { PersonaProfile } from '@/types/persona'

interface Props {
  persona: PersonaProfile
}

const EMOJIS = ['🔥', '🚀', '💡', '🎯', '📈']

export default function HookIdeas({ persona }: Props) {
  const [hooks, setHooks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHooks() {
      if (!persona) return
      setLoading(true)
      setHooks([])
      setError('')
      try {
        const res = await fetch('/api/hooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: persona.summary || persona.name })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Request failed')
        setHooks(Array.isArray(data.hooks) ? data.hooks.slice(0, 5) : [])
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchHooks()
  }, [persona])

  const copy = (text: string) => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy', err)
    })
  }

  return (
    <div className="border border-white/10 bg-background text-foreground p-4 rounded-xl space-y-3">
      <h3 className="text-lg font-bold">Top Hook Ideas</h3>
      {loading && <Spinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ul className="space-y-2">
        {hooks.map((hook, idx) => (
          <li key={idx} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-md">
            <span className="flex items-center gap-2 text-sm">
              <span>{EMOJIS[idx % EMOJIS.length]}</span>
              <span>{hook}</span>
            </span>
            <button
              type="button"
              onClick={() => copy(hook)}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded"
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
