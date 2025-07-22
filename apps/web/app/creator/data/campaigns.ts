export type Campaign = {
  id: string;
  brand: string;
  title: string;
  description: string;
  platform: string;
  niche: string;
  budgetMin: number;
  budgetMax: number;
  deliverables?: string;
  deadline?: string;
  compensationType?: string;
};

const campaigns: Campaign[] = [
  {
    id: "1",
    brand: "GlowUp Cosmetics",
    title: "Spring Skincare Launch",
    description: "Instagram Reels and Stories demoing the new skincare line",
    platform: "Instagram",
    niche: "Beauty",
    budgetMin: 500,
    budgetMax: 1000,
    deliverables: "1 IG Reel and 3 Story frames highlighting product benefits",
    deadline: "2025-12-31",
    compensationType: "flat_fee",
  },
  {
    id: "2",
    brand: "Plantify",
    title: "Urban Jungle Challenge",
    description: "TikTok video showing a plant makeover or styling tip",
    platform: "TikTok",
    niche: "Home & Plants",
    budgetMin: 300,
    budgetMax: 800,
    deliverables: "2 posts showcasing plants, 1 short testimonial video",
    deadline: "2025-11-15",
    compensationType: "commission",
  },
  {
    id: "3",
    brand: "Techify",
    title: "AI Gadget Review",
    description: "YouTube review of our latest AI gadget",
    platform: "YouTube",
    niche: "Tech",
    budgetMin: 700,
    budgetMax: 1500,
    deliverables: "Blog article or video review and 5 social shares",
    deadline: "2025-10-01",
    compensationType: "hybrid",
  },
];

export default campaigns;
