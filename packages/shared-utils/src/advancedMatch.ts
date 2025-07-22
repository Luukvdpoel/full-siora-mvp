export interface AdvancedBrandBrief {
  description?: string;
  targetAudience?: string[];
  tone?: string;
  contentTypes?: string[];
  platform?: string;
}

export interface AdvancedCreatorProfile {
  bio?: string;
  audience?: string[];
  brandVoice?: string;
  bestFormats?: string[];
  platform?: string;
}

import { getEmbedding } from './openai';

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase()));
}

function fuzzyMatch(a?: string, b?: string): number {
  if (!a || !b) return 0;
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  if (la === lb) return 1;
  if (la.includes(lb) || lb.includes(la)) return 0.7;
  const wordsA = la.split(/[^a-z0-9]+/);
  const wordsB = lb.split(/[^a-z0-9]+/);
  const setB = new Set(wordsB);
  const common = wordsA.filter(w => setB.has(w));
  return common.length / Math.max(wordsA.length, wordsB.length);
}

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (!normA || !normB) return 0;
  return dot / (normA * normB);
}

async function logMatch(score: number) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'advanced_match', properties: { score } }),
    });
  } catch {}
}

export interface MatchResult {
  confidence: number;
  explanation: string;
  details: string[];
}

export async function advancedMatch(
  brief: AdvancedBrandBrief,
  persona: AdvancedCreatorProfile,
): Promise<MatchResult> {
  const details: string[] = [];
  let score = 0;

  const audienceCommon = overlap(brief.targetAudience, persona.audience);
  const audienceScore = (audienceCommon.length / (brief.targetAudience?.length || 1)) * 20;
  score += audienceScore;
  if (audienceCommon.length > 0) details.push(`Audience overlap on ${audienceCommon.join(', ')}`);

  const toneSim = fuzzyMatch(brief.tone, persona.brandVoice);
  const toneScore = toneSim * 20;
  score += toneScore;
  if (toneSim > 0.8) details.push('Tone closely aligned');
  else if (toneSim > 0.4) details.push('Tone somewhat aligned');

  const formatOverlap = overlap(brief.contentTypes, persona.bestFormats);
  const formatScore = (formatOverlap.length / (brief.contentTypes?.length || 1)) * 20;
  score += formatScore;
  if (formatOverlap.length > 0) details.push(`Format match: ${formatOverlap.join(', ')}`);

  const platformSim = fuzzyMatch(brief.platform, persona.platform);
  const platformScore = platformSim > 0.6 ? 10 : 0;
  score += platformScore;
  if (platformSim > 0.6) details.push('Platform match');

  const textA = [brief.description, brief.tone, brief.targetAudience?.join(' '), brief.contentTypes?.join(' ')]
    .filter(Boolean)
    .join(' ');
  const textB = [persona.bio, persona.brandVoice, persona.audience?.join(' '), persona.bestFormats?.join(' ')]
    .filter(Boolean)
    .join(' ');

  if (textA && textB) {
    try {
      const [embA, embB] = await Promise.all([getEmbedding(textA), getEmbedding(textB)]);
      const sim = cosineSim(embA, embB);
      score += sim * 30;
      if (sim > 0.5) details.push('High text similarity');
      else if (sim > 0.2) details.push('Some text similarity');
    } catch {}
  }

  const confidence = Math.round(Math.min(100, Math.max(0, score)));
  const explanation = details[0] || 'Overall similarity';

  await logMatch(confidence);

  return { confidence, explanation, details };
}
