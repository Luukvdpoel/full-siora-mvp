export interface BrandOpportunity {
  id: string;
  name: string;
  logo: string;
  lookingFor: string;
  industry: string;
  tags: string[];
}

export const brandOpportunities: BrandOpportunity[] = [
  {
    id: 'o1',
    name: 'TechTrends',
    logo: 'https://via.placeholder.com/80?text=TT',
    lookingFor: 'Creators to showcase our latest gadgets in engaging unboxings.',
    industry: 'Tech',
    tags: ['tech', 'gadgets', 'innovation'],
  },
  {
    id: 'o2',
    name: 'FitFuel',
    logo: 'https://via.placeholder.com/80?text=FitFuel',
    lookingFor: 'Fitness enthusiasts to demo our new plant protein line.',
    industry: 'Fitness',
    tags: ['fitness', 'nutrition'],
  },
  {
    id: 'o3',
    name: 'GlowUp',
    logo: 'https://via.placeholder.com/80?text=GlowUp',
    lookingFor: 'Beauty creators to review our summer skincare launch.',
    industry: 'Beauty',
    tags: ['beauty', 'skincare'],
  },
  {
    id: 'o4',
    name: 'MindfulLife',
    logo: 'https://via.placeholder.com/80?text=Mindful',
    lookingFor: 'Wellness influencers for a meditation app campaign.',
    industry: 'Wellness',
    tags: ['wellness', 'meditation'],
  },
  {
    id: 'o5',
    name: 'FreshBite',
    logo: 'https://via.placeholder.com/80?text=Fresh',
    lookingFor: 'Food bloggers to feature our new meal kits.',
    industry: 'Food',
    tags: ['food', 'organic'],
  },
  {
    id: 'o6',
    name: 'HomeEase',
    logo: 'https://via.placeholder.com/80?text=HomeEase',
    lookingFor: 'DIY creators to highlight smart home products.',
    industry: 'Home',
    tags: ['home', 'smart-tech'],
  },
];
