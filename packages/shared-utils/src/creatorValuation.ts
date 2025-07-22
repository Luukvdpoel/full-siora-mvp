export interface CreatorValuationMetrics {
  /** Total followers or subscribers */
  audienceSize: number;
  /** Average engagement rate as a percentage */
  engagementRate: number;
  /** Number of completed paid collaborations */
  pastCollabs: number;
  /** Quality score from 1 (poor) to 5 (excellent) */
  contentQuality: number;
}

export interface CreatorROI {
  roi: number;
  notes: string[];
}

/**
 * Rough estimate of potential ROI when working with a creator.
 * The calculation uses engaged audience size as a base and
 * applies multipliers for content quality and past collab experience.
 */
export function estimateCreatorROI(metrics: CreatorValuationMetrics): CreatorROI {
  const { audienceSize, engagementRate, pastCollabs, contentQuality } = metrics;
  const engaged = (audienceSize * engagementRate) / 100;
  const qualityMultiplier = 0.5 + Math.min(Math.max(contentQuality, 1), 5) / 10; // 0.6-1.0
  const collabMultiplier = 1 + Math.min(pastCollabs, 5) / 10; // up to 1.5
  const roi = Math.round(engaged * qualityMultiplier * collabMultiplier);

  const notes: string[] = [];
  if (pastCollabs > 0) notes.push('Experienced with brand deals');
  if (contentQuality >= 4) notes.push('High content quality');
  if (engagementRate > 5) notes.push('Strong engagement');

  return { roi, notes };
}
