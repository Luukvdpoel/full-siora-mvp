import type { BrandProfile, CreatorPersona, AgeRange } from './fitScoreEngine';

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlap = Math.max(0, end - start);
  const span = Math.max(b.max - b.min, 1);
  return overlap / span;
}

export function generateMatchExplanation(
  brand: BrandProfile,
  creator: CreatorPersona
): string[] {
  const notes: string[] = [];

  if (
    brand.tone &&
    creator.tone &&
    brand.tone.toLowerCase() === creator.tone.toLowerCase()
  ) {
    notes.push(`Matches your tone: ${creator.tone}`);
  }

  if (creator.pastCollabs && brand.categories) {
    const overlap = creator.pastCollabs.filter((c) =>
      brand.categories!.some((b) => b.toLowerCase() === c.toLowerCase())
    );
    if (overlap.length > 0) notes.push('Has worked with similar brands');
  } else if (brand.niches && creator.niches) {
    const match = creator.niches.find((n) =>
      brand.niches!.some((b) => b.toLowerCase() === n.toLowerCase())
    );
    if (match) notes.push('Active in your niche');
  }

  const ageOverlap = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  if (ageOverlap > 0.5) {
    notes.push('Audience fits your target age');
  }

  return notes;
}
