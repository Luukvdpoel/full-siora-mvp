export interface DiscoveryBrand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  vibes: string[];
  values: string[];
  pastCampaigns: string[];
  verified?: boolean;
  rating: number; // average creator review out of 5
  responseHours: number; // average response time in hours
  paymentDays: number; // average payment turnaround in days
  completionRate: number; // percent of campaigns completed
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
  pastCampaigns: ['GlowSummer', 'SPFLaunch', 'HolidayGlow'],
  verified: true,
  rating: 4.8,
  responseHours: 12,
  paymentDays: 5,
  completionRate: 98,
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
    verified: true,
    rating: 4.5,
    responseHours: 24,
    paymentDays: 7,
    completionRate: 95,
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
    rating: 4.0,
    responseHours: 36,
    paymentDays: 10,
    completionRate: 90,
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
    rating: 3.8,
    responseHours: 48,
    paymentDays: 15,
    completionRate: 85,
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
    rating: 4.2,
    responseHours: 20,
    paymentDays: 8,
    completionRate: 92,
  },
  {
    id: 'b6',
    name: 'GlowUp Cosmetics',
    logo: 'https://via.placeholder.com/80?text=GlowUp',
    tagline: 'Radiate confidence',
    industry: 'Beauty',
    vibes: ['glam', 'fresh'],
    values: ['cruelty-free'],
    pastCampaigns: ['SpringLaunch'],
    verified: true,
    rating: 4.6,
    responseHours: 18,
    paymentDays: 6,
    completionRate: 96,
  },
  {
    id: 'b7',
    name: 'Plantify',
    logo: 'https://via.placeholder.com/80?text=Plantify',
    tagline: 'Urban jungle made easy',
    industry: 'Home & Plants',
    vibes: ['natural', 'cheerful'],
    values: ['sustainable'],
    pastCampaigns: ['UrbanJungle'],
    rating: 4.3,
    responseHours: 22,
    paymentDays: 7,
    completionRate: 93,
  },
  {
    id: 'b8',
    name: 'Techify',
    logo: 'https://via.placeholder.com/80?text=Techify',
    tagline: 'Smarter living',
    industry: 'Tech',
    vibes: ['sleek', 'innovative'],
    values: ['cutting-edge'],
    pastCampaigns: ['AIGadget'],
    rating: 4.1,
    responseHours: 30,
    paymentDays: 9,
    completionRate: 90,
  },
];
