export type CampaignTemplate = {
  id: string;
  label: string;
  name: string;
  goals: string;
  product: string;
  creators: string;
  budget: string;
};

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "launch-hype",
    label: "Product Launch Hype",
    name: "Launch Buzz Campaign",
    goals: "Create excitement and initial sales for our new product.",
    product: "Introduce the key features of the product launching this quarter.",
    creators: "Lifestyle or tech creators with high engagement.",
    budget: "$1k - $3k",
  },
  {
    id: "ambassador-search",
    label: "Ambassador Search",
    name: "Brand Ambassador Program",
    goals: "Find long-term creators who align with our brand values.",
    product: "Ongoing product line with new drops each season.",
    creators: "Creators passionate about our niche willing to be long-term partners.",
    budget: "$500 - $2k per month",
  },
  {
    id: "reels-only",
    label: "Reels-Only Collab",
    name: "Quick Reels Collab",
    goals: "Drive short-form engagement with punchy Reels.",
    product: "Showcase our hero product in creative 30s videos.",
    creators: "Creators skilled at eye-catching Reels.",
    budget: "$800 - $1.5k",
  },
  {
    id: "seasonal-giveaway",
    label: "Seasonal Giveaway",
    name: "Holiday Giveaway Blast",
    goals: "Boost followers and newsletter sign-ups via a giveaway.",
    product: "Feature our seasonal bundle as the prize.",
    creators: "Creators with audiences excited about lifestyle products.",
    budget: "$300 - $1k",
  },
];
