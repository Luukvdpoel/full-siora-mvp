import type { PersonaProfile } from '../types/persona'

export default function InsightsSidebar({ profile }: { profile: PersonaProfile }) {
  if (!profile) return null;

  return (
    <aside className="border border-gray-300 dark:border-zinc-700 p-4 rounded-xl shadow-md bg-white text-black dark:bg-zinc-800 dark:text-white space-y-2 w-full max-w-xs">
      <h3 className="text-lg font-bold">Insights</h3>
      <div>
        <span className="font-semibold">Posting:</span> {profile.postingFrequency ?? 'N/A'}
      </div>
      <div>
        <span className="font-semibold">Tone Confidence:</span>{' '}
        {profile.toneConfidence != null ? `${profile.toneConfidence}%` : 'N/A'}
      </div>
      <div>
        <span className="font-semibold">Brand Fit:</span> {profile.brandFit ?? 'N/A'}
      </div>
      <div>
        <span className="font-semibold">Growth Tips:</span>
        <p className="text-sm">{profile.growthSuggestions ?? 'N/A'}</p>
      </div>
    </aside>
  );
}
