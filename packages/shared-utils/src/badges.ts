export interface Badge {
  id: string;
  label: string;
}

export interface CreatorBadgeData {
  verified?: boolean;
  completedCollabs?: number;
  avgResponseMinutes?: number;
}

export function getCreatorBadges(data: CreatorBadgeData): Badge[] {
  const badges: Badge[] = [];
  if (data.verified) {
    badges.push({ id: 'verified', label: 'Verified Creator' });
  }
  if ((data.completedCollabs ?? 0) >= 3) {
    badges.push({ id: 'collabs3', label: 'Completed 3+ Collabs' });
  }
  if (data.avgResponseMinutes != null && data.avgResponseMinutes <= 60) {
    badges.push({ id: 'fast-responder', label: 'Fast Responder' });
  }
  return badges;
}

export interface BrandBadgeData {
  verified?: boolean;
  pastCampaigns?: number;
}

export function getBrandBadges(data: BrandBadgeData): Badge[] {
  const badges: Badge[] = [];
  if (data.verified) {
    badges.push({ id: 'verified-brand', label: 'Verified Brand' });
  }
  if ((data.pastCampaigns ?? 0) >= 3) {
    badges.push({ id: 'campaigns3', label: 'Ran 3+ Campaigns' });
  }
  return badges;
}
