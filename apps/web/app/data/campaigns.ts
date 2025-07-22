export type Campaign = {
  id: string;
  brand: string;
  name: string;
  requirements: string;
  budgetMin: number;
  budgetMax: number;
  platform: string;
  niche: string;
  compensationType?: string;
};

export const campaigns: Campaign[] = [
  {
    id: "1",
    brand: "GlowUp Cosmetics",
    name: "Spring Skincare Launch",
    requirements: "Instagram Reels and Stories demoing the new skincare line",
    budgetMin: 500,
    budgetMax: 1000,
    platform: "Instagram",
    niche: "Beauty",
    compensationType: "flat_fee",
  },
  {
    id: "2",
    brand: "Plantify",
    name: "Urban Jungle Challenge",
    requirements: "TikTok video showing a plant makeover or styling tip",
    budgetMin: 300,
    budgetMax: 800,
    platform: "TikTok",
    niche: "Home & Plants",
    compensationType: "commission",
  },
  {
    id: "3",
    brand: "Techify",
    name: "AI Gadget Review",
    requirements: "YouTube review of our latest AI gadget",
    budgetMin: 700,
    budgetMax: 1500,
    platform: "YouTube",
    niche: "Tech",
    compensationType: "hybrid",
  },
];
