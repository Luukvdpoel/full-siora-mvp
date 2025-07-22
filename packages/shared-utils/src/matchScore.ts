import type { AgeRange, CreatorPersona, BrandProfile } from './fitScoreEngine';
import { getEmbedding } from './openai';

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase()));
}

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlapAmt = Math.max(0, end - start);
  const span = Math.max(1, b.max - b.min);
  return overlapAmt / span;
}

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (!normA || !normB) return 0;
  return dot / (normA * normB);
}

function profileText(creator: CreatorPersona): string {
  return [
    creator.tone,
    creator.vibe,
    creator.niches?.join(' '),
    creator.platforms?.join(' '),
    creator.formats?.join(' '),
    creator.partnershipPreference,
    creator.supportWish,
  ]
    .filter(Boolean)
    .join(' ');
}

function brandText(brand: BrandProfile & { platforms?: string[] }): string {
  return [
    brand.name,
    brand.tone,
    brand.values?.join(' '),
    brand.niches?.join(' '),
    brand.desiredFormats?.join(' '),
    brand.categories?.join(' '),
    brand.platforms?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');
}

async function logMatch(score: number) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'match_score', properties: { score } }),
    });
  } catch {}
}

export async function matchScore(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] }
): Promise<{ score: number; explanation: string }> {
  // numeric metrics
  let numeric = 0;
  const reasons: string[] = [];

  const toneMatch =
    creator.tone && brand.tone && creator.tone.toLowerCase() === brand.tone.toLowerCase();
  if (toneMatch) {
    numeric += 10;
    reasons.push('Tone match');
  }

  const platformOverlap = overlap(creator.platforms, brand.platforms);
  if (brand.platforms && brand.platforms.length > 0) {
    const s = (platformOverlap.length / brand.platforms.length) * 10;
    numeric += s;
    if (platformOverlap.length > 0) reasons.push(`Platforms: ${platformOverlap.join(', ')}`);
  }

  const formatOverlap = overlap(creator.formats, brand.desiredFormats);
  if (brand.desiredFormats && brand.desiredFormats.length > 0) {
    const s = (formatOverlap.length / brand.desiredFormats.length) * 10;
    numeric += s;
    if (formatOverlap.length > 0) reasons.push(`Formats: ${formatOverlap.join(', ')}`);
  }

  const ageFactor = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  numeric += ageFactor * 10;
  if (ageFactor > 0) reasons.push('Audience age overlap');

  const nicheOverlap = overlap(creator.niches, brand.niches);
  const nicheScore = (nicheOverlap.length / (brand.niches?.length || 1)) * 10;
  numeric += nicheScore;
  if (nicheOverlap.length > 0) reasons.push(`Niches: ${nicheOverlap.join(', ')}`);

  // text embeddings
  const [creatorEmb, brandEmb] = await Promise.all([
    getEmbedding(profileText(creator)),
    getEmbedding(brandText(brand)),
  ]);
  const textSim = cosineSim(creatorEmb, brandEmb);
  const textScore = textSim * 50;

  const finalScore = Math.round(Math.min(100, numeric + textScore));
  const explanation = reasons[0] || 'Overall similarity';

  await logMatch(finalScore);

  return { score: finalScore, explanation };
}
