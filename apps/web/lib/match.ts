import type { CreatorPersona, BrandProfile } from '../../../packages/shared-utils/src/fitScoreEngine';
import { advancedMatch } from '../../../packages/shared-utils/src/advancedMatch';

export async function matchCreator(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] },
): Promise<{ score: number; reason: string }> {
  const brief = {
    description: brand.name,
    targetAudience: brand.niches,
    tone: brand.tone,
    contentTypes: brand.desiredFormats,
    platform: brand.platforms?.[0],
  };
  const persona = {
    bio: creator.vibe,
    audience: creator.niches,
    brandVoice: creator.tone,
    bestFormats: creator.formats,
    platform: creator.platforms?.[0],
  };
  const { confidence, explanation } = await advancedMatch(brief, persona);
  return { score: confidence, reason: explanation };
}

export default matchCreator;
