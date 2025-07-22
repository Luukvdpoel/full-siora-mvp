import type { CreatorPersona, BrandProfile, AgeRange } from './fitScoreEngine';
import { getEmbedding } from './openai';

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
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
  return overlap / span;
}

async function logMatchScore(data: any) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'match_score', properties: data }),
    });
  } catch {}
}

export interface AdvancedCreator extends CreatorPersona {
  bio?: string;
}

export interface AdvancedBrand extends BrandProfile {
  description?: string;
}

export async function advancedMatch(
  creator: AdvancedCreator,
  brand: AdvancedBrand
): Promise<{ score: number; explanation: string }> {
  const brandText = [
    brand.name,
    brand.description,
    brand.tone,
    brand.values?.join(' '),
    brand.desiredFormats?.join(' '),
    brand.niches?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  const creatorText = [
    creator.bio,
    creator.tone,
    creator.vibe,
    creator.formats?.join(' '),
    creator.niches?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  let similarity = 0;
  try {
    const [brandVec, creatorVec] = await Promise.all([
      getEmbedding(brandText),
      getEmbedding(creatorText),
    ]);
    similarity = cosineSimilarity(brandVec, creatorVec);
  } catch {
    similarity = 0;
  }

  const reasons: string[] = [];
  let numeric = 0;

  if (creator.tone && brand.tone) {
    const toneMatch = creator.tone.toLowerCase() === brand.tone.toLowerCase();
    numeric += toneMatch ? 15 : 0;
    if (toneMatch) reasons.push('Tone aligns');
  }

  const formatOverlap = arrayOverlap(creator.formats, brand.desiredFormats);
  if (brand.desiredFormats) {
    numeric += (formatOverlap.length / brand.desiredFormats.length) * 15;
    if (formatOverlap.length > 0) reasons.push('Preferred formats match');
  }

  const ageScore = rangeOverlap(creator.ageRange, brand.targetAgeRange) * 10;
  numeric += ageScore;
  if (ageScore > 5) reasons.push('Audience age overlap');

  const nicheOverlap = arrayOverlap(creator.niches, brand.niches);
  numeric += (nicheOverlap.length / (brand.niches?.length || 1)) * 10;
  if (nicheOverlap.length > 0) reasons.push('Shared niche');

  const final = Math.round(Math.min(100, (similarity * 50) + numeric));
  await logMatchScore({
    brand: brand.name,
    creator: creator.bio,
    similarity,
    numeric,
    final,
  });

  return { score: final, explanation: reasons[0] || 'Textual similarity' };
}

