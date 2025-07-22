import type { CreatorPersona } from './fitScoreEngine';

export interface CampaignBrief {
  name?: string;
  description?: string;
  idealPersona?: string[];
  platforms?: string[];
  deliverables?: string[];
  goals?: string[];
  commissionOnly?: boolean;
}

function fuzzyMatch(a: string, b: string): boolean {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  return lowerA.includes(lowerB) || lowerB.includes(lowerA);
}

function fuzzyOverlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  return a.filter(x => b.some(y => fuzzyMatch(x, y)));
}

/**
 * Calculate how well a creator persona fits a campaign brief.
 * Returns a score from 0 to 100 and textual reasons for the score.
 */
export function getCampaignFitScore(
  campaign: CampaignBrief,
  creator: CreatorPersona
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Platform alignment (30)
  const platformMatch = fuzzyOverlap(campaign.platforms, creator.platforms);
  const platformScore =
    (platformMatch.length / (campaign.platforms?.length || 1)) * 30;
  score += platformScore;
  if (platformMatch.length > 0) {
    reasons.push(`Platforms: ${platformMatch.join(', ')}`);
  } else {
    reasons.push('Platform mismatch');
  }

  // Deliverables vs creator formats (25)
  const formatMatch = fuzzyOverlap(campaign.deliverables, creator.formats);
  const formatScore =
    (formatMatch.length / (campaign.deliverables?.length || 1)) * 25;
  score += formatScore;
  if (formatMatch.length > 0) {
    reasons.push(`Formats: ${formatMatch.join(', ')}`);
  } else {
    reasons.push('Content format mismatch');
  }

  // Goals alignment (25)
  const goalMatch = fuzzyOverlap(campaign.goals, creator.goals);
  const goalScore = (goalMatch.length / (campaign.goals?.length || 1)) * 25;
  score += goalScore;
  if (goalMatch.length > 0) {
    reasons.push(`Shared goals: ${goalMatch.join(', ')}`);
  } else if (campaign.goals && campaign.goals.length > 0) {
    reasons.push('Different goals');
  }

  // Ideal persona or niche/tone match (20)
  const personaMatch = fuzzyOverlap(campaign.idealPersona, creator.niches);
  const personaScore =
    (personaMatch.length / (campaign.idealPersona?.length || 1)) * 20;
  score += personaScore;
  if (personaMatch.length > 0) {
    reasons.push(`Niche match: ${personaMatch.join(', ')}`);
  } else if (campaign.idealPersona && campaign.idealPersona.length > 0) {
    reasons.push('Niche does not match');
  }

  if (campaign.commissionOnly && creator.dealPreference) {
    const dp = creator.dealPreference.toLowerCase();
    if (dp.includes('no affiliate-only') || dp.includes('value-based')) {
      score -= 15;
      reasons.push('Creator dislikes commission-only deals');
    }
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, score)));
  return { score: finalScore, reasons };
}
