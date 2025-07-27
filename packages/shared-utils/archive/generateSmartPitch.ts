import type { CreatorPersona, BrandProfile } from './fitScoreEngine';

function overlap(a?: string[], b?: string[]): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(v => v.toLowerCase()));
  return a.filter(v => setB.has(v.toLowerCase()));
}

function first(arr?: string[]): string | undefined {
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
}

/**
 * Generate a short personalized pitch a creator can send to a brand.
 */
export function generateSmartPitch(
  creator: CreatorPersona,
  brand: BrandProfile
): { subject: string; message: string } {
  const brandName = brand.name || 'your brand';

  const sharedNiche = overlap(creator.niches, brand.niches)[0];
  const sharedValue = overlap(
    creator.vibe ? creator.vibe.split(/[,\s]+/) : undefined,
    brand.values
  )[0];
  const ideaFormat =
    overlap(creator.formats, brand.desiredFormats)[0] || first(creator.formats);

  const subject = `Collab idea with ${brandName}`;

  const lines: string[] = [];
  lines.push(`Hi ${brandName} team,`);
  const introTone = creator.tone ? creator.tone.toLowerCase() : 'passionate';
  const niche = first(creator.niches) || 'content';
  lines.push(
    `I'm a ${introTone} creator focused on ${niche}.`);

  if (sharedNiche || sharedValue) {
    const fit = sharedNiche || sharedValue;
    lines.push(`I love that we both care about ${fit}.`);
  }

  if (ideaFormat) {
    lines.push(
      `I'd love to feature ${brandName} in a ${ideaFormat} for my audience.`
    );
  } else {
    lines.push(`I'd love to show my audience how I use ${brandName}.`);
  }

  lines.push('Let me know if this resonates!');

  const message = lines.join(' ');

  return { subject, message };
}
