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
  const overlapAmount = Math.max(0, end - start);
  const span = Math.max(b.max - b.min, 1);
  return overlapAmount / span;
}

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (normA * normB || 1);
}

async function logScore(score: number, reason: string) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'match_score', properties: { score, reason } }),
    });
  } catch {}
}

export async function matchScore(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] }
): Promise<{ score: number; reason: string }> {
  const creatorText = [
    creator.tone,
    creator.vibe,
    creator.niches?.join(' '),
    creator.platforms?.join(' '),
    creator.formats?.join(' '),
    creator.goals?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  const brandText = [
    brand.tone,
    brand.values?.join(' '),
    brand.niches?.join(' '),
    brand.platforms?.join(' '),
    brand.desiredFormats?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  let textScore = 0;
  try {
    if (process.env.OPENAI_API_KEY) {
      const [cEmb, bEmb] = await Promise.all([
        getEmbedding(creatorText),
        getEmbedding(brandText),
      ]);
      textScore = (cosineSim(cEmb, bEmb) + 1) / 2; // 0..1
    }
  } catch {
    textScore = 0;
  }

  let metrics = 0;
  const reasons: { score: number; text: string }[] = [];

  const toneMatch =
    creator.tone && brand.tone &&
    creator.tone.toLowerCase() === brand.tone.toLowerCase();
  if (toneMatch) {
    reasons.push({ score: 15, text: 'Tone match' });
    metrics += 15;
  }

  const formatOverlap = overlap(creator.formats, brand.desiredFormats);
  if (formatOverlap.length > 0) {
    reasons.push({ score: 15, text: `Format match: ${formatOverlap.join(', ')}` });
    metrics += 15;
  }

  const nicheOverlap = overlap(creator.niches, brand.niches);
  if (nicheOverlap.length > 0) {
    reasons.push({ score: 10, text: `Shared niches: ${nicheOverlap.join(', ')}` });
    metrics += 10;
  }

  const ageRatio = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  if (ageRatio > 0) {
    const ageScore = Math.round(ageRatio * 10);
    reasons.push({ score: ageScore, text: 'Audience age overlap' });
    metrics += ageScore;
  }

  const platformOverlap = overlap(creator.platforms, brand.platforms);
  if (platformOverlap.length > 0) {
    reasons.push({ score: 5, text: `Platform match: ${platformOverlap.join(', ')}` });
    metrics += 5;
  }

  const final = Math.round(Math.min(100, textScore * 40 + metrics));
  const topReason = reasons.sort((a, b) => b.score - a.score)[0]?.text || 'Overall similarity';

  await logScore(final, topReason);

  return { score: final, reason: topReason };
}
