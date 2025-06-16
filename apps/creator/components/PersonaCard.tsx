import { PersonaProfile } from '../types/persona'

export default function PersonaCard({ profile }: { profile: PersonaProfile }) {
  return (
    <div className="border border-white/10 bg-background text-foreground p-4 sm:p-6 rounded-xl shadow-sm space-y-2">
      <h2 className="text-xl font-bold">{profile.name}</h2>
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

