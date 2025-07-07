export interface CreatorInfo {
  id: string;
  name: string;
  handle?: string;
  tone: string;
  platform: string;
  niche: string;
}

export interface BrandCriteria {
  tone: string;
  platforms: string[];
  targetNiches: string[];
}

export interface RankedCreator {
  creator: CreatorInfo;
  score: number;
  reasons: string[];
}

function textMatch(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function rankCreators(
  creators: CreatorInfo[],
  brand: BrandCriteria
): RankedCreator[] {
  const results = creators.map((c) => {
    const reasons: string[] = [];
    let score = 0;

    if (brand.tone && textMatch(c.tone, brand.tone)) {
      score += 40;
      reasons.push('Tone match');
    } else if (brand.tone) {
      reasons.push('Tone differs');
    }

    const platformMatch = brand.platforms.some((p) => textMatch(p, c.platform));
    if (platformMatch) {
      score += 30;
      reasons.push('Preferred platform');
    } else {
      reasons.push('Different platform');
    }

    const nicheMatch = brand.targetNiches.some((n) => textMatch(n, c.niche));
    if (nicheMatch) {
      score += 30;
      reasons.push('Audience overlap');
    } else {
      reasons.push('Audience mismatch');
    }

    return { creator: c, score, reasons };
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 10);
}
