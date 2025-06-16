import { PersonaProfile } from '../types/persona'

export default function PersonaCard({ profile }: { profile: PersonaProfile }) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white p-4 shadow sm:p-6 dark:bg-zinc-900 dark:text-white">
      <h2 className="text-xl font-bold">{profile.name}</h2>
      <p className="italic">{profile.personality}</p>
      <div className="flex flex-wrap gap-2">
        {profile.interests.map((tag, i) => (
          <span
            key={i}
            className="rounded-full bg-indigo-100 px-2 py-1 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{profile.summary}</p>
    </div>
  );
}

