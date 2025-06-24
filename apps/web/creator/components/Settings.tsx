'use client'

import { useEffect, useState } from 'react'
import type { FullPersona } from '../types/persona'

export interface ExtendedPersona extends FullPersona {
  tagline?: string
  contentPreference?: string
  favFormats?: string
  preferredCollabs?: string
}

interface Props {
  persona: ExtendedPersona
  onChange?: (p: ExtendedPersona) => void
}

export default function Settings({ persona, onChange }: Props) {
  const [tagline, setTagline] = useState<string>(persona.tagline || '')
  const [bio, setBio] = useState<string>(persona.summary || '')
  const [contentPref, setContentPref] = useState<string>(persona.contentPreference || '')
  const [formats, setFormats] = useState<string[]>(
    persona.favFormats ? persona.favFormats.split(',').map((f) => f.trim()) : []
  )
  const [collabs, setCollabs] = useState<string>(persona.preferredCollabs || '')

  useEffect(() => {
    const updated: ExtendedPersona = {
      ...persona,
      summary: bio,
      tagline,
      contentPreference: contentPref,
      favFormats: formats.join(','),
      preferredCollabs: collabs
    }
    onChange?.(updated)
  }, [tagline, bio, contentPref, formats, collabs, onChange, persona])

  const toggleFormat = (f: string) => {
    setFormats((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  const formatOptions = ['Short form video', 'Threads', 'Photos', 'Livestreams']

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full p-2 rounded-md bg-background text-foreground border border-white/10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded-md bg-background text-foreground border border-white/10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Content Preference</label>
        <input
          type="text"
          value={contentPref}
          onChange={(e) => setContentPref(e.target.value)}
          className="w-full p-2 rounded-md bg-background text-foreground border border-white/10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Favorite Formats</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {formatOptions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFormat(f)}
              className={`px-3 py-1 rounded-full border text-sm ${formats.includes(f) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-background border-white/20 text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Preferred Collaborations</label>
        <input
          type="text"
          value={collabs}
          onChange={(e) => setCollabs(e.target.value)}
          className="w-full p-2 rounded-md bg-background text-foreground border border-white/10"
        />
      </div>
      <div className="border border-white/10 rounded-lg p-4 bg-background">
        <h3 className="text-lg font-semibold">Preview</h3>
        <p className="mt-2 text-xl font-bold">{persona.name}</p>
        {tagline && <p className="italic text-foreground/80">{tagline}</p>}
        <p className="mt-2 whitespace-pre-line text-sm">{bio}</p>
        {contentPref && <p className="mt-2 text-sm text-foreground/80">Content: {contentPref}</p>}
        {formats.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-sm text-foreground/80">
            {formats.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        {collabs && (
          <p className="mt-2 text-sm text-foreground/80">Collabs: {collabs}</p>
        )}
      </div>
    </div>
  )
}
