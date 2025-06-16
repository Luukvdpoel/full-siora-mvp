import type { AgeRange, CreatorPersona, BrandProfile } from './fitScoreEngine';

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase()));
}

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlapAmount = Math.max(0, end - start);
  const span = Math.max(b.max - b.min, 1);
  return overlapAmount / span;
}

export function matchScore(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] }
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Platform match (25)
  const platformOverlap = overlap(creator.platforms, brand.platforms);
  if (brand.platforms && brand.platforms.length > 0) {
    const platformScore =
      (platformOverlap.length / brand.platforms.length) * 25;
    score += platformScore;
    if (platformOverlap.length > 0)
      reasons.push(`Platform match: ${platformOverlap.join(', ')}`);
    else reasons.push('Preferred platforms differ');
  } else {
    reasons.push('Brand has no platform preference');
  }

  // Vibe/tone overlap (25)
  const vibeWords = creator.vibe ? creator.vibe.split(/[,\s]+/) : undefined;
  const toneWords = brand.tone ? brand.tone.split(/[,\s]+/) : undefined;
  const vibeOverlap = overlap(vibeWords, brand.values);
  const toneOverlap = overlap(creator.tone ? [creator.tone] : undefined, toneWords);
  const vibeToneScore =
    ((vibeOverlap.length / (brand.values?.length || 1)) * 15) +
    (toneOverlap.length > 0 ? 10 : 0);
  score += vibeToneScore;
  if (toneOverlap.length > 0) reasons.push('Tone aligns');
  if (vibeOverlap.length > 0)
    reasons.push(`Shared vibe: ${vibeOverlap.join(', ')}`);
  if (toneOverlap.length === 0 && vibeOverlap.length === 0)
    reasons.push('Tone/vibe mismatch');

  // Audience alignment (25)
  const ageScore = rangeOverlap(creator.ageRange, brand.targetAgeRange) * 12.5;
  score += ageScore;
  if (ageScore > 7) reasons.push('Strong age overlap');
  else if (ageScore > 0) reasons.push('Some age overlap');
  else reasons.push('Age mismatch');

  const nicheOverlap = overlap(creator.niches, brand.niches);
  const nicheScore =
    (nicheOverlap.length / (brand.niches?.length || 1)) * 12.5;
  score += nicheScore;
  if (nicheOverlap.length > 0)
    reasons.push(`Shared niches: ${nicheOverlap.join(', ')}`);
  else reasons.push('Different niches');

  // Format preferences (25)
  const formatOverlap = overlap(creator.formats, brand.desiredFormats);
  const formatScore =
    (formatOverlap.length / (brand.desiredFormats?.length || 1)) * 25;
  score += formatScore;
  if (formatOverlap.length > 0)
    reasons.push(`Preferred formats: ${formatOverlap.join(', ')}`);
  else reasons.push('Formats differ');

  const finalScore = Math.round(Math.max(0, Math.min(100, score)));
  return { score: finalScore, reasons };
}

