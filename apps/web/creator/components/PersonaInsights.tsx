import React from 'react';
import type { FullPersona } from '../types/persona'

export default function PersonaInsights({ persona }: { persona: FullPersona }) {
  const { name, summary, vibe, tone, goals, interests, platforms, painPoints } = persona

  const tag = (label: string, value?: string) =>
    value ? (
      <span className="px-2 py-1 rounded-full text-sm text-white" style={{ backgroundColor: '#6366f1' }}>
        {label}: {value}
      </span>
    ) : null

  return (
    <div className="border border-white/10 bg-background text-foreground p-4 rounded-xl space-y-3">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-foreground/80">{summary}</p>
      <div className="flex flex-wrap gap-2">
        {tag('Vibe', vibe)}
        {tag('Tone', tone)}
        {goals && goals.map((g, i) => (
          <span key={i} className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
            {g}
          </span>
        ))}
        {interests &&
          interests.map((interest, idx) => (
            <span key={`i-${idx}`} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              {interest}
            </span>
          ))}
        {platforms && platforms.map((p, i) => (
          <span key={`p-${i}`} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            {p}
          </span>
        ))}
      </div>
      {painPoints && painPoints.length > 0 && (
        <div>
          <h3 className="font-semibold mt-2">Pain Points</h3>
          <ul className="list-disc list-inside text-sm text-foreground/80">
            {painPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
