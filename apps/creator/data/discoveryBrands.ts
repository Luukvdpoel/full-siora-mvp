export interface DiscoveryBrand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  vibes: string[];
  values: string[];
  pastCampaigns: string[];
}

export const discoveryBrands: DiscoveryBrand[] = [
  {
    id: 'b1',
    name: 'Glow Cosmetics',
    logo: 'https://via.placeholder.com/80?text=Glow',
    tagline: 'Shine naturally',
    industry: 'Beauty',
    vibes: ['vibrant', 'youthful'],
    values: ['cruelty-free', 'sustainable'],
    pastCampaigns: ['GlowSummer', 'SPFLaunch'],
  },
  {
    id: 'b2',
    name: 'FitFuel',
    logo: 'https://via.placeholder.com/80?text=FitFuel',
    tagline: 'Power your workouts',
    industry: 'Fitness',
    vibes: ['energetic', 'bold'],
    values: ['vegan', 'health'],
    pastCampaigns: ['ProteinBar2024'],
  },
  {
    id: 'b3',
    name: 'EcoHome',
    logo: 'https://via.placeholder.com/80?text=EcoHome',
    tagline: 'Zero-waste living',
    industry: 'Home',
    vibes: ['minimal', 'clean'],
    values: ['eco-friendly'],
    pastCampaigns: ['ZeroWasteKit'],
  },
  {
    id: 'b4',
    name: 'TechVerse',
    logo: 'https://via.placeholder.com/80?text=TechVerse',
    tagline: 'Future gadgets today',
    industry: 'Technology',
    vibes: ['futuristic', 'sleek'],
    values: ['innovation'],
    pastCampaigns: ['VRLaunch'],
  },
  {
    id: 'b5',
    name: 'FreshBite',
    logo: 'https://via.placeholder.com/80?text=FreshBite',
    tagline: 'Taste the freshness',
    industry: 'Food',
    vibes: ['fun', 'colorful'],
    values: ['organic'],
    pastCampaigns: ['SummerSalads'],
  },
];
