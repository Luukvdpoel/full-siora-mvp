export type Campaign = {
  id: string;
  brand: string;
  title: string;
  description: string;
};

const campaigns: Campaign[] = [
  {
    id: '1',
    brand: 'Glowify Cosmetics',
    title: 'Summer Glow Launch',
    description: 'Seeking beauty creators to promote our new dewy foundation line.',
  },
  {
    id: '2',
    brand: 'FitGear',
    title: 'Fall Fitness Push',
    description: 'Looking for energetic influencers to showcase our workout gear.',
  },
  {
    id: '3',
    brand: 'EcoHome',
    title: 'Green Living Tips',
    description: 'Creators passionate about sustainability to share our eco products.',
  },
];

export default campaigns;
