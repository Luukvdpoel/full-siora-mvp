export interface AgeRange {
  min: number;
  max: number;
}

export interface CreatorPersona {
  ageRange?: AgeRange;
  niches?: string[];
  tone?: string;
  vibe?: string;
  platforms?: string[];
  formats?: string[];
  pastCollabs?: string[];
}

export interface BrandProfile {
  name?: string;
  targetAgeRange?: AgeRange;
  niches?: string[];
  tone?: string;
  values?: string[];
  desiredFormats?: string[];
  categories?: string[];
}

function arrayOverlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => setB.has(x.toLowerCase()));
}

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlap = Math.max(0, end - start);
  const span = Math.max(b.max - b.min, 1);
  return overlap / span; // portion of brand range covered
}

export function getFitScore(
  creator: CreatorPersona,
  brand: BrandProfile
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Audience overlap: age + niche + tone (30)
  const ageFactor = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  if (ageFactor > 0.6) reasons.push('Strong age overlap');
  else if (ageFactor > 0) reasons.push('Some age overlap');
  else reasons.push('Different target ages');
  score += ageFactor * 10;

  const nicheCommon = arrayOverlap(creator.niches, brand.niches);
  if (nicheCommon.length > 0)
    reasons.push(`Shared niches: ${nicheCommon.join(', ')}`);
  else reasons.push('Niche mismatch');
  const nicheScore = (nicheCommon.length / (brand.niches?.length || 1)) * 10;
  score += nicheScore;

  if (creator.tone && brand.tone) {
    const sameTone = creator.tone.toLowerCase() === brand.tone.toLowerCase();
    score += sameTone ? 10 : 5;
    reasons.push(sameTone ? 'Matching tone' : 'Different tone');
  }

  // Values & vibe alignment (25)
  const valueOverlap = arrayOverlap(
    creator.vibe ? creator.vibe.split(/[,\s]+/) : undefined,
    brand.values
  );
  const valueScore = (valueOverlap.length / (brand.values?.length || 1)) * 25;
  score += valueScore;
  if (valueOverlap.length > 0)
    reasons.push(`Values align: ${valueOverlap.join(', ')}`);
  else reasons.push('Values/vibe differ');

  // Format compatibility (25)
  const formatCommon = arrayOverlap(creator.formats, brand.desiredFormats);
  const formatScore =
    (formatCommon.length / (brand.desiredFormats?.length || 1)) * 25;
  score += formatScore;
  if (formatCommon.length > 0)
    reasons.push(`Compatible formats: ${formatCommon.join(', ')}`);
  else reasons.push("Content formats don't match");

  // Past collaborations (20)
  const collabCommon = arrayOverlap(creator.pastCollabs, brand.categories);
  const collabScore = Math.min(collabCommon.length, 1) * 20;
  score += collabScore;
  if (collabCommon.length > 0)
    reasons.push(`Past experience with ${collabCommon.join(', ')}`);
  else reasons.push('No related past collaborations');

  const finalScore = Math.round(Math.max(0, Math.min(100, score)));
  return { score: finalScore, reason: reasons.join('; ') };
}
