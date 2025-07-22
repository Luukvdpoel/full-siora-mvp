import React from 'react';
import { PersonaProfile } from '../types/persona'
import { Badge } from 'shared-ui'
import { getCreatorBadges } from 'shared-utils'

export default function PersonaCard({ profile }: { profile: PersonaProfile }) {
  const badges = getCreatorBadges({
    verified: profile.verified,
    completedCollabs: profile.completedCollabs,
    avgResponseMinutes: profile.avgResponseMinutes,
  })

  return (
    <div className="border border-white/10 bg-background text-foreground p-4 sm:p-6 rounded-xl shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{profile.name}</h2>
        {badges.map((b) => (
          <Badge key={b.id} label={b.label} />
        ))}
      </div>
      <p className="italic">{profile.personality}</p>
      <div className="flex flex-wrap gap-2">
        {profile.interests.map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{profile.summary}</p>
    </div>
  )
}

