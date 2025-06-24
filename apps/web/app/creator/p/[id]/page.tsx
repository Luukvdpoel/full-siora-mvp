import PersonaCard from '@creator/components/PersonaCard';
import InsightsSidebar from '@creator/components/InsightsSidebar';
import CopyLinkButton from '@creator/components/CopyLinkButton';
import { prisma } from '@creator/lib/auth';
import type { PersonaProfile } from '@creator/types/persona';

interface PageParams {
  params: { id: string };
}

const computeBrandFit = (interests: string[]): string => {
  const lower = interests.map((i) => i.toLowerCase());
  const fitness = ['fitness', 'workout', 'health', 'wellness'];
  const fashion = ['fashion', 'style', 'beauty', 'clothing'];
  if (lower.some((i) => fitness.some((k) => i.includes(k)))) return 'fitness';
  if (lower.some((i) => fashion.some((k) => i.includes(k)))) return 'fashion';
  return 'business';
};

const computePostingFrequency = (fit: string): string => {
  switch (fit) {
    case 'fitness':
      return '5 posts/week';
    case 'fashion':
      return '3 posts/week';
    case 'business':
      return '2 posts/week';
    default:
      return '3 posts/week';
  }
};

const computeGrowthSuggestions = (fit: string): string => {
  switch (fit) {
    case 'fitness':
      return 'Share workout tips daily and track progress with before/after posts.';
    case 'fashion':
      return 'Post seasonal lookbooks and tag the brands you wear.';
    case 'business':
      return 'Publish case studies and network on LinkedIn.';
    default:
      return 'Collaborate with peers and experiment with short-form video.';
  }
};

const ensureInsights = (p: PersonaProfile): PersonaProfile => {
  const fit = p.brandFit ?? computeBrandFit(p.interests ?? []);
  return {
    ...p,
    brandFit: fit,
    postingFrequency: p.postingFrequency ?? computePostingFrequency(fit),
    growthSuggestions: p.growthSuggestions ?? computeGrowthSuggestions(fit),
    toneConfidence: p.toneConfidence ?? 75,
  };
};

export default async function PublicPersonaPage({ params }: PageParams) {
  const persona = await prisma.persona.findUnique({ where: { id: params.id } });
  if (!persona) {
    return <main className="p-6">Persona not found.</main>;
  }

  const profile = ensureInsights(persona.data as PersonaProfile);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-6">
      <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
        <PersonaCard profile={profile} />
        <InsightsSidebar profile={profile} />
      </div>
      <div>
        <CopyLinkButton />
      </div>
    </main>
  );
}
