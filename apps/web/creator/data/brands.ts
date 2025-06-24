export interface Brand {
  id: string;
  name: string;
  campaign: string;
  niche: string;
  summary: string;
}

export const brands: Brand[] = [
  {
    id: '1',
    name: 'Glow Cosmetics',
    campaign: 'Summer skincare launch',
    niche: 'Beauty',
    summary: 'Looking for skincare creators to promote our new SPF line.',
  },
  {
    id: '2',
    name: 'FitFuel',
    campaign: 'Plant protein bars',
    niche: 'Fitness',
    summary: 'Seeking active lifestyle influencers to highlight our vegan protein bars.',
  },
  {
    id: '3',
    name: 'EcoHome',
    campaign: 'Zero-waste home essentials',
    niche: 'Home & Sustainability',
    summary: 'Partnering with eco-conscious creators to showcase waste-free living tips.',
  },
];
