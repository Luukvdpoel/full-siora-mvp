import type { PersonaProfile } from '../types/persona'

export default function InsightsSidebar({ profile }: { profile: PersonaProfile }) {
  if (!profile) return null;

  return (
    <aside className="w-full max-w-xs space-y-2 rounded-xl border border-white/10 bg-white p-4 shadow sm:p-6 dark:bg-zinc-900 dark:text-white">
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
