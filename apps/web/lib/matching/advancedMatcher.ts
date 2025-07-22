export interface AdvancedBrand {
  values?: string[];
  tone?: string;
  campaignType?: string;
  brief?: string;
}

export interface AdvancedCreator {
  values?: string[];
  tone?: string;
  successRate?: number; // 0-1 scale
  partnershipPreferences?: string[];
  personaText?: string;
}

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase()));
}

async function gptNarrativeScore(brief?: string, persona?: string): Promise<number> {
  if (!brief || !persona) return 0;
  try {
    const { callOpenAI } = await import('shared-utils');
    const content = await callOpenAI({
      messages: [
        {
          role: 'system',
          content: 'Rate how well this creator persona fits the brand brief from 0 to 1. Respond with just the number.'
        },
        { role: 'user', content: `BRAND BRIEF:\n${brief}\nCREATOR PERSONA:\n${persona}` }
      ],
      temperature: 0,
      fallback: '0'
    });
    const num = parseFloat(content);
    if (isNaN(num)) return 0;
    return Math.max(0, Math.min(1, num));
  } catch {
    return 0;
  }
}

export async function advancedMatch(
  creator: AdvancedCreator,
  brand: AdvancedBrand
): Promise<{ score: number; reasons: string[] }> {
  let score = 0;
  const reasons: string[] = [];

  // Persona-brand value overlap (30)
  const valueOverlap = overlap(creator.values, brand.values);
  const valueScore = (valueOverlap.length / (brand.values?.length || 1)) * 30;
  score += valueScore;
  if (valueOverlap.length > 0) {
    reasons.push(`Shared values: ${valueOverlap.join(', ')}`);
  }

  // Tone compatibility (20)
  if (
    creator.tone &&
    brand.tone &&
    creator.tone.toLowerCase() === brand.tone.toLowerCase()
  ) {
    score += 20;
    reasons.push('Tone aligned');
  }

  // Prior deal success rate (20)
  if (typeof creator.successRate === 'number') {
    const successScore = Math.max(0, Math.min(1, creator.successRate)) * 20;
    score += successScore;
    reasons.push(`Past deal success ${Math.round(creator.successRate * 100)}%`);
  }

  // Partnership preferences (10)
  if (creator.partnershipPreferences && creator.partnershipPreferences.length > 0) {
    const prefs = creator.partnershipPreferences.map(p => p.toLowerCase());
    const ct = brand.campaignType?.toLowerCase() || '';
    if (prefs.some(p => p.includes('no affiliate') && ct.includes('affiliate'))) {
      reasons.push('Avoids affiliate-only deals');
    } else if (prefs.some(p => p.includes('long-term') && ct.includes('long-term'))) {
      score += 10;
      reasons.push('Wants long-term partnerships');
    } else {
      score += 5;
      reasons.push('Neutral partnership prefs');
    }
  }

  // Narrative compatibility via GPT (20)
  const narrative = await gptNarrativeScore(brand.brief, creator.personaText);
  const narrativeScore = narrative * 20;
  if (narrativeScore > 0) {
    score += narrativeScore;
    reasons.push('Narrative fit confirmed by GPT');
  }

  const final = Math.round(Math.min(100, score));
  return { score: final, reasons };
}
