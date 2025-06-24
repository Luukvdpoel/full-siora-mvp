export interface Collab {
  id: string;
  brand: string;
  campaign: string;
  status: 'active' | 'pending payment' | 'completed';
  earnings: number;
  rating?: number;
  review?: string;
}

const collabs: Collab[] = [
  {
    id: '1',
    brand: 'Glow Cosmetics',
    campaign: 'Summer Glow Launch',
    status: 'active',
    earnings: 500,
  },
  {
    id: '2',
    brand: 'FitFuel',
    campaign: 'Protein Bar Campaign',
    status: 'pending payment',
    earnings: 800,
    rating: 5,
    review: 'Great communication and easy to work with.'
  },
  {
    id: '3',
    brand: 'EcoHome',
    campaign: 'Green Living Tips',
    status: 'completed',
    earnings: 350,
    rating: 4,
    review: 'Overall positive experience with some minor delays.'
  }
];

export default collabs;
