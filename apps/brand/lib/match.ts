import type { CreatorPersona, BrandProfile, AgeRange } from '../../packages/shared-utils/src/fitScoreEngine';

function overlap<T extends string>(a?: T[], b?: T[]): T[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase())) as T[];
}

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlapAmt = Math.max(0, end - start);
  const span = Math.max(1, b.max - b.min);
  return overlapAmt / span;
}

/**
 * Evaluate how well a creator matches a brand's campaign needs.
 * Returns a score from 0 to 100 and short text explaining the fit.
 */
export function matchCreator(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] }
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Tone (25)
  if (creator.tone && brand.tone && creator.tone.toLowerCase() === brand.tone.toLowerCase()) {
    score += 25;
    reasons.push('Tone matches');
  }

  // Platforms (25)
  const platformMatch = overlap(creator.platforms, brand.platforms);
  if (brand.platforms && brand.platforms.length > 0) {
    const portion = platformMatch.length / brand.platforms.length;
    score += portion * 25;
    if (platformMatch.length > 0) {
      reasons.push(`Platforms: ${platformMatch.join(', ')}`);
    }
  }

  // Audience (25)
  const ageFactor = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  if (ageFactor > 0) {
    score += ageFactor * 25;
    reasons.push('Audience aligns');
  }

  // Content type (25)
  const formatMatch = overlap(creator.formats, brand.desiredFormats);
  if (brand.desiredFormats && brand.desiredFormats.length > 0) {
    const portion = formatMatch.length / brand.desiredFormats.length;
    score += portion * 25;
    if (formatMatch.length > 0) {
      reasons.push(`Content: ${formatMatch.join(', ')}`);
    }
  }

  if (reasons.length === 0) {
    reasons.push('Few similarities');
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, score)));
  return { score: finalScore, reason: reasons.join('; ') };
}

export default matchCreator;
