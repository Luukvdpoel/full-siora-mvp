export interface BrandCampaignBrief {
  targetAudience?: string[];
  tone?: string;
  contentTypes?: string[];
  platform?: string;
}

export interface CreatorPersonaProfile {
  audience?: string[];
  brandVoice?: string;
  bestFormats?: string[];
  platform?: string;
}

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(x => x.toLowerCase()));
  return a.filter(x => setB.has(x.toLowerCase()));
}

function fuzzyMatch(a?: string, b?: string): number {
  if (!a || !b) return 0;
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  if (lowerA === lowerB) return 1;
  if (lowerA.includes(lowerB) || lowerB.includes(lowerA)) return 0.7;
  const wordsA = lowerA.split(/[^a-z0-9]+/);
  const wordsB = lowerB.split(/[^a-z0-9]+/);
  const setB = new Set(wordsB);
  const common = wordsA.filter(w => setB.has(w));
  return common.length / Math.max(wordsA.length, wordsB.length);
}

export function briefPersonaMatch(
  brief: BrandCampaignBrief,
  persona: CreatorPersonaProfile
): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;

  // Audience overlap (40)
  const audienceCommon = overlap(brief.targetAudience, persona.audience);
  const audienceScore =
    (audienceCommon.length / (brief.targetAudience?.length || 1)) * 40;
  score += audienceScore;
  if (audienceCommon.length > 0)
    details.push(`Audience overlap on ${audienceCommon.join(', ')}`);
  else if (brief.targetAudience && persona.audience)
    details.push('Different audiences');

  // Tone/style match (30)
  const toneSimilarity = fuzzyMatch(brief.tone, persona.brandVoice);
  const toneScore = toneSimilarity * 30;
  score += toneScore;
  if (toneSimilarity > 0.8) details.push('Tone closely aligned');
  else if (toneSimilarity > 0.4) details.push('Tone somewhat aligned');
  else if (brief.tone && persona.brandVoice) details.push('Tone differs');

  // Platform match (15)
  const platformSimilarity = fuzzyMatch(brief.platform, persona.platform);
  const platformScore = platformSimilarity > 0.6 ? 15 : 0;
  score += platformScore;
  if (platformSimilarity > 0.6) details.push('Platform match');
  else if (brief.platform && persona.platform) details.push('Different platform');

  // Format alignment (15)
  const formatOverlap = overlap(brief.contentTypes, persona.bestFormats);
  const formatScore =
    (formatOverlap.length / (brief.contentTypes?.length || 1)) * 15;
  score += formatScore;
  if (formatOverlap.length > 0)
    details.push(`Format match: ${formatOverlap.join(', ')}`);
  else if (brief.contentTypes && persona.bestFormats)
    details.push('Content format mismatch');

  const finalScore = Math.round(Math.min(100, Math.max(0, score)));
  return { score: finalScore, details };
}
