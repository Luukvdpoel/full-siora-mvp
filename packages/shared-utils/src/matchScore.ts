import type { AgeRange, CreatorPersona, BrandProfile } from './fitScoreEngine';
import { callOpenAI, getEmbedding } from './openai';

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map((v) => v.toLowerCase()));
  return a.filter((v) => setB.has(v.toLowerCase()));
}

function rangeOverlap(a?: AgeRange, b?: AgeRange): number {
  if (!a || !b) return 0;
  const start = Math.max(a.min, b.min);
  const end = Math.min(a.max, b.max);
  const overlapAmt = Math.max(0, end - start);
  const span = Math.max(b.max - b.min, 1);
  return overlapAmt / span;
}

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (normA * normB || 1);
}

async function logMatchScore(props: { brand?: string; creator?: string; score: number }) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'match_score', properties: props }),
    });
  } catch {}
}

export async function matchScore(
  creator: CreatorPersona,
  brand: BrandProfile & { platforms?: string[] }
): Promise<{ score: number; explanation: string }> {
  const creatorText = [
    creator.tone,
    creator.vibe,
    creator.niches?.join(' '),
    creator.formats?.join(' '),
    creator.goals?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  const brandText = [
    brand.tone,
    brand.values?.join(' '),
    brand.niches?.join(' '),
    brand.desiredFormats?.join(' '),
    brand.categories?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  let textScore = 0;
  try {
    const [cEmbed, bEmbed] = await Promise.all([
      getEmbedding(creatorText),
      getEmbedding(brandText),
    ]);
    const sim = cosineSim(cEmbed, bEmbed);
    textScore = sim * 60;
  } catch (err) {
    console.error('Embedding similarity failed', err);
  }

  let numeric = 0;
  const notes: string[] = [];

  if (creator.tone && brand.tone && creator.tone.toLowerCase() === brand.tone.toLowerCase()) {
    numeric += 10;
    notes.push('Tone match');
  }

  const formatOverlap = overlap(creator.formats, brand.desiredFormats);
  if (formatOverlap.length > 0) {
    numeric += 10;
    notes.push(`Formats: ${formatOverlap.join(', ')}`);
  }

  const platformOverlap = overlap(creator.platforms, brand.platforms);
  if (platformOverlap.length > 0) {
    numeric += 10;
    notes.push(`Platforms: ${platformOverlap.join(', ')}`);
  }

  const age = rangeOverlap(creator.ageRange, brand.targetAgeRange);
  numeric += age * 10;
  if (age > 0.5) notes.push('Audience age overlap');

  const nicheOverlap = overlap(creator.niches, brand.niches);
  if (nicheOverlap.length > 0) {
    numeric += 10;
    notes.push(`Niches: ${nicheOverlap.join(', ')}`);
  }

  const score = Math.round(Math.min(100, textScore + numeric));

  const explanation = await callOpenAI({
    messages: [
      { role: 'system', content: 'Explain in one short sentence why this creator matches the brand.' },
      { role: 'user', content: `Brand info: ${brandText}\nCreator info: ${creatorText}` },
    ],
    temperature: 0.6,
    maxRetries: 1,
    fallback: notes.join('; '),
  });

  await logMatchScore({ brand: brand.name, score, creator: undefined });

  return { score, explanation };
}
